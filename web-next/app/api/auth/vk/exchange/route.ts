import { NextResponse } from "next/server";
import { loginWithVk, validateVkAccessToken } from "@/lib/auth";

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 10;
const MAX_BODY_BYTES = 8_192;
const MAX_TOKEN_LENGTH = 4_096;
const attempts = new Map<string, { count: number; resetAt: number }>();
let lastRateSweep = 0;

class PayloadTooLargeError extends Error {}

/**
 * POST /api/auth/vk/exchange
 * Body: { access_token: string }
 *
 * Клиент после VKID.Auth.exchangeCode получает access_token и шлёт нам сюда.
 * Мы валидируем через VK API, заводим/обновляем пользователя, ставим session cookie.
 */
export async function POST(request: Request) {
  if (process.env.VK_LOGIN_ENABLED !== "1") {
    return json({ error: "not_found" }, 404);
  }
  const contentType = request.headers.get("content-type")?.split(";", 1)[0];
  if (contentType?.trim().toLowerCase() !== "application/json") {
    return json({ error: "unsupported_media_type" }, 415);
  }
  if (!hasTrustedOrigin(request)) {
    return json({ error: "forbidden_origin" }, 403);
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return json({ error: "payload_too_large" }, 413);
  }

  const rate = takeRateLimitSlot(clientKey(request));
  if (!rate.allowed) {
    return json({ error: "rate_limited" }, 429, {
      "Retry-After": String(rate.retryAfter),
    });
  }

  let body: unknown;
  try {
    body = JSON.parse(await readLimitedBody(request));
  } catch (error) {
    if (error instanceof PayloadTooLargeError) {
      return json({ error: "payload_too_large" }, 413);
    }
    return json({ error: "invalid_json" }, 400);
  }

  const accessToken =
    body && typeof body === "object" && "access_token" in body
      ? (body as { access_token?: unknown }).access_token
      : undefined;
  if (
    typeof accessToken !== "string" ||
    accessToken.length === 0 ||
    accessToken.length > MAX_TOKEN_LENGTH
  ) {
    return json({ error: "missing_or_invalid_access_token" }, 400);
  }

  const vkUser = await validateVkAccessToken(accessToken);
  if (!vkUser) {
    return json({ error: "vk_validation_failed" }, 401);
  }

  const user = await loginWithVk(vkUser);
  return json({
    user: {
      id: user.id,
      vk_id: user.vk_id,
      name: user.name,
      avatar: user.avatar,
    },
  });
}

function json(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {}
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

function hasTrustedOrigin(request: Request) {
  const rawOrigin = request.headers.get("origin");
  if (!rawOrigin) return false;
  let origin: string;
  try {
    origin = new URL(rawOrigin).origin;
  } catch {
    return false;
  }

  const trusted = new Set([new URL(request.url).origin]);
  const host = request.headers.get("host");
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",", 1)[0]
    ?.trim();
  const protocol = forwardedProtocol || new URL(request.url).protocol.slice(0, -1);
  if (host && (protocol === "http" || protocol === "https")) {
    try {
      trusted.add(new URL(`${protocol}://${host}`).origin);
    } catch {
      // Невалидный Host не расширяет allowlist.
    }
  }
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      trusted.add(new URL(configured).origin);
    } catch {
      // next.config validates the public URL for metadata; fail closed here.
    }
  }
  return trusted.has(origin);
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",", 1)[0];
  return (
    request.headers.get("x-real-ip")?.trim() ||
    forwarded?.trim() ||
    "unknown"
  );
}

function takeRateLimitSlot(key: string) {
  const now = Date.now();
  if (now - lastRateSweep >= RATE_WINDOW_MS || attempts.size >= 10_000) {
    for (const [entryKey, value] of attempts) {
      if (value.resetAt <= now) attempts.delete(entryKey);
    }
    lastRateSweep = now;
  }

  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    if (!attempts.has(key) && attempts.size >= 10_000) {
      const oldestKey = attempts.keys().next().value as string | undefined;
      if (oldestKey) attempts.delete(oldestKey);
    }
    attempts.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= RATE_LIMIT) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  current.count++;
  return { allowed: true, retryAfter: 0 };
}

async function readLimitedBody(request: Request) {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

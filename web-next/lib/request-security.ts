import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 8_192;
const RATE_WINDOW_MS = 60_000;
const DEFAULT_RATE_LIMIT = 12;
const attempts = new Map<string, { count: number; resetAt: number }>();
let lastSweep = 0;

export class PayloadTooLargeError extends Error {}

export function jsonNoStore(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {}
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

export function hasTrustedOrigin(request: Request) {
  const rawOrigin = request.headers.get("origin");
  if (!rawOrigin) return false;

  let origin: string;
  try {
    origin = new URL(rawOrigin).origin;
  } catch {
    return false;
  }

  const requestUrl = new URL(request.url);
  const trusted = new Set([requestUrl.origin]);
  const host = request.headers.get("host");
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",", 1)[0]
    ?.trim();
  const protocol = forwardedProtocol || requestUrl.protocol.slice(0, -1);
  if (host && (protocol === "http" || protocol === "https")) {
    try {
      trusted.add(new URL(`${protocol}://${host}`).origin);
    } catch {
      // Невалидный Host не расширяет allowlist.
    }
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      trusted.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {
      // Ошибка конфигурации не должна ослаблять проверку.
    }
  }
  return trusted.has(origin);
}

export function checkMutationRequest(
  request: Request,
  options: { requireJson?: boolean; rateScope?: string; rateLimit?: number } = {}
) {
  if (!hasTrustedOrigin(request)) {
    return jsonNoStore({ error: "forbidden_origin" }, 403);
  }
  if (options.requireJson) {
    const contentType = request.headers.get("content-type")?.split(";", 1)[0];
    if (contentType?.trim().toLowerCase() !== "application/json") {
      return jsonNoStore({ error: "unsupported_media_type" }, 415);
    }
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_BYTES) {
    return jsonNoStore({ error: "payload_too_large" }, 413);
  }
  if (options.rateScope) {
    return checkRateLimit(
      `${options.rateScope}:${clientKey(request)}`,
      options.rateLimit ?? DEFAULT_RATE_LIMIT
    );
  }
  return null;
}

export function checkRateLimit(key: string, limit = DEFAULT_RATE_LIMIT) {
  const rate = takeRateLimitSlot(key, limit);
  if (rate.allowed) return null;
  return jsonNoStore({ error: "rate_limited" }, 429, {
    "Retry-After": String(rate.retryAfter),
  });
}

export async function readJsonBody(request: Request): Promise<unknown> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let value = "";
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    total += chunk.value.byteLength;
    if (total > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    value += decoder.decode(chunk.value, { stream: true });
  }
  value += decoder.decode();
  return JSON.parse(value);
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",", 1)[0];
  return request.headers.get("x-real-ip")?.trim() || forwarded?.trim() || "unknown";
}

function takeRateLimitSlot(key: string, limit: number) {
  const now = Date.now();
  if (now - lastSweep >= RATE_WINDOW_MS || attempts.size >= 10_000) {
    for (const [entryKey, value] of attempts) {
      if (value.resetAt <= now) attempts.delete(entryKey);
    }
    lastSweep = now;
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
  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

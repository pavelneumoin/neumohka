import { NextResponse } from "next/server";
import { loginWithVk } from "@/lib/auth";
import {
  isValidVkAccessToken,
  isValidVkId,
  validateVkAccessToken,
} from "@/lib/vk-auth";

/**
 * POST /api/auth/vk/exchange
 * Body: { access_token: string, user_id: number }
 *
 * Клиент после VKID.Auth.exchangeCode получает access_token и шлёт нам сюда.
 * Мы валидируем через VK API, заводим/обновляем пользователя, ставим session cookie.
 */
export async function POST(request: Request) {
  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (contentType !== "application/json") {
    return NextResponse.json(
      { error: "unsupported_media_type" },
      { status: 415 }
    );
  }

  const origin = request.headers.get("origin");
  if (!origin || !isSameOrigin(origin, request)) {
    return NextResponse.json({ error: "cross_origin_request" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("invalid_json_shape");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const accessToken = body.access_token;
  const userId = body.user_id;
  if (!isValidVkAccessToken(accessToken) || !isValidVkId(userId)) {
    return NextResponse.json(
      { error: "missing_access_token_or_user_id" },
      { status: 400 }
    );
  }

  const appId = Number(
    process.env.VK_APP_ID || process.env.NEXT_PUBLIC_VK_APP_ID || 0
  );
  if (!isValidVkId(appId)) {
    console.error("[auth] VK_APP_ID is not configured");
    return NextResponse.json({ error: "vk_not_configured" }, { status: 503 });
  }

  const validation = await validateVkAccessToken(accessToken, userId, appId);
  if (!validation.ok) {
    if (validation.reason === "provider_unavailable") {
      return NextResponse.json(
        { error: "vk_temporarily_unavailable" },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "vk_validation_failed" },
      { status: 401 }
    );
  }

  const user = await loginWithVk(validation.user);
  return NextResponse.json({
    user: {
      id: user.id,
      vk_id: user.vk_id,
      name: user.name,
      avatar: user.avatar,
    },
  });
}

function isSameOrigin(origin: string, request: Request): boolean {
  try {
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",", 1)[0]
      .trim();
    const host = forwardedHost || request.headers.get("host");
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",", 1)[0]
      .trim();
    const protocol =
      forwardedProtocol || new URL(request.url).protocol.slice(0, -1);
    if (!host || !["http", "https"].includes(protocol)) return false;

    const expectedOrigin = new URL(`${protocol}://${host}`).origin;
    return new URL(origin).origin === expectedOrigin;
  } catch {
    return false;
  }
}

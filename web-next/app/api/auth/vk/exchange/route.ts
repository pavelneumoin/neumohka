import { NextResponse } from "next/server";
import { loginWithVk, validateVkAccessToken } from "@/lib/auth";

/**
 * POST /api/auth/vk/exchange
 * Body: { access_token: string, user_id: number }
 *
 * Клиент после VKID.Auth.exchangeCode получает access_token и шлёт нам сюда.
 * Мы валидируем через VK API, заводим/обновляем пользователя, ставим session cookie.
 */
export async function POST(request: Request) {
  let body: { access_token?: string; user_id?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const accessToken = body.access_token;
  const userId = Number(body.user_id);
  if (!accessToken || !userId) {
    return NextResponse.json(
      { error: "missing_access_token_or_user_id" },
      { status: 400 }
    );
  }

  const vkUser = await validateVkAccessToken(accessToken, userId);
  if (!vkUser) {
    return NextResponse.json(
      { error: "vk_validation_failed" },
      { status: 401 }
    );
  }

  const user = await loginWithVk(vkUser);
  return NextResponse.json({
    user: {
      id: user.id,
      vk_id: user.vk_id,
      name: user.name,
      avatar: user.avatar,
    },
  });
}

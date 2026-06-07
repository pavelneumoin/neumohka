/**
 * Auth для Phase 1: VK ID OAuth + сессионные cookie.
 * - Клиент логинится через VK OneTap (Low-code) → получает code+device_id.
 * - Клиент через VKID.Auth.exchangeCode получает access_token+user_id.
 * - Клиент шлёт нам POST /api/auth/vk/exchange { access_token, user_id }.
 * - Бэкенд через service_token валидирует пользователя через users.get,
 *   создаёт/обновляет User, создаёт Session, ставит cookie httpOnly.
 */

import { cookies } from "next/headers";
import {
  createSession,
  deleteSession,
  getSessionByToken,
  getUserById,
  upsertUser,
  type User,
} from "@/lib/store";

const SESSION_COOKIE = "nm_session";
const VK_SERVICE_TOKEN = process.env.VK_SERVICE_TOKEN ?? "";

export type VkUserPayload = {
  id: number;
  first_name: string;
  last_name: string;
  photo_100: string | null;
};

/**
 * Валидируем access_token VK ID через users.get.
 * Возвращает user info, либо null если токен невалидный/просрочен.
 */
export async function validateVkAccessToken(
  accessToken: string,
  userId: number
): Promise<VkUserPayload | null> {
  if (!accessToken || !userId) return null;
  // VK API: users.get принимает access_token самого пользователя.
  // service_token нужен для запросов без user-context, нам не подходит здесь.
  const url = new URL("https://api.vk.com/method/users.get");
  url.searchParams.set("user_ids", String(userId));
  url.searchParams.set("fields", "photo_100");
  url.searchParams.set("access_token", accessToken);
  url.searchParams.set("v", "5.199");
  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });
    const json = await res.json();
    if (json.error) {
      console.warn("[auth] VK users.get error:", json.error);
      return null;
    }
    const u = Array.isArray(json.response) ? json.response[0] : null;
    if (!u || u.id !== userId) return null;
    return {
      id: u.id,
      first_name: u.first_name ?? "",
      last_name: u.last_name ?? "",
      photo_100: u.photo_100 ?? null,
    };
  } catch (err) {
    console.warn("[auth] VK users.get fetch failed:", err);
    return null;
  }
}

/** Логин: создаёт/обновляет User + Session, ставит cookie. Возвращает User. */
export async function loginWithVk(payload: VkUserPayload): Promise<User> {
  const user = upsertUser({
    vk_id: payload.id,
    name: `${payload.first_name} ${payload.last_name}`.trim() || "Пользователь",
    avatar: payload.photo_100,
  });
  const session = createSession(user.id);
  const c = await cookies();
  c.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expires_at),
  });
  return user;
}

/** Возвращает текущего залогиненного пользователя или null. */
export async function getCurrentUser(): Promise<User | null> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = getSessionByToken(token);
  if (!session) return null;
  return getUserById(session.user_id);
}

/** Текущий session token (для middleware/проверок). */
export async function getCurrentSessionToken(): Promise<string | null> {
  const c = await cookies();
  return c.get(SESSION_COOKIE)?.value ?? null;
}

/** Выход: удаляет сессию из БД и cookie. */
export async function logout() {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (token) deleteSession(token);
  c.delete(SESSION_COOKIE);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
// Re-export для удобства использования VK_SERVICE_TOKEN в server-side кодах
export const VK_SERVICE_TOKEN_VALUE = VK_SERVICE_TOKEN;

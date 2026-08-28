/**
 * Auth для Phase 1: VK ID OAuth + сессионные cookie.
 * - Клиент логинится через VK OneTap (Low-code) → получает code+device_id.
 * - Клиент через VKID.Auth.exchangeCode получает access_token+user_id.
 * - Клиент шлёт нам POST /api/auth/vk/exchange { access_token, user_id }.
 * - Бэкенд валидирует access token через app-bound VK ID user_info,
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
import type { VkUserPayload } from "@/lib/vk-auth";

const SESSION_COOKIE = "nm_session";

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

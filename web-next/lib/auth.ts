/**
 * Авторизация по логину и паролю + httpOnly-сессии. Legacy-функции VK оставлены
 * только для совместимости старых серверных данных; endpoint выключен по умолчанию.
 */

import { cookies } from "next/headers";
import {
  createPasswordUser,
  createSession,
  deleteSession,
  getSessionByToken,
  getUserById,
  getUserByUsername,
  upsertUser,
  type User,
} from "@/lib/store";
import {
  hashPassword,
  isValidPassword,
  isValidUsername,
  normalizeUsername,
  verifyPassword,
} from "@/lib/password";

const SESSION_COOKIE = "nm_session";
const VK_APP_ID = Number(process.env.NEXT_PUBLIC_VK_APP_ID || 0);

export type VkUserPayload = {
  id: number;
  first_name: string;
  last_name: string;
  photo_100: string | null;
};

/**
 * Валидируем access_token через VK ID user_info. Идентификатор пользователя
 * берётся только из ответа VK, а не из данных клиента.
 * Возвращает user info, либо null если токен невалидный/просрочен.
 */
export async function validateVkAccessToken(
  accessToken: string
): Promise<VkUserPayload | null> {
  if (!accessToken || !VK_APP_ID) return null;
  const url = new URL("https://id.vk.com/oauth2/user_info");
  url.searchParams.set("client_id", String(VK_APP_ID));
  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ access_token: accessToken }),
      cache: "no-store",
    });
    const json = (await res.json()) as {
      user?: {
        user_id?: string | number;
        first_name?: string;
        last_name?: string;
        avatar?: string;
      };
      error?: unknown;
    };
    if (!res.ok || json.error || !json.user) {
      console.warn("[auth] VK user_info error:", json.error ?? res.status);
      return null;
    }
    const userId = Number(json.user.user_id);
    if (!Number.isSafeInteger(userId) || userId <= 0) return null;
    return {
      id: userId,
      first_name: json.user.first_name ?? "",
      last_name: json.user.last_name ?? "",
      photo_100: json.user.avatar ?? null,
    };
  } catch (err) {
    console.warn("[auth] VK user_info fetch failed:", err);
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
  await startSession(user);
  return user;
}

export type PasswordAuthResult =
  | { ok: true; user: User }
  | { ok: false; error: "invalid_fields" | "username_taken" | "invalid_credentials" };

export async function registerWithPassword(input: {
  username: string;
  password: string;
  name: string;
}): Promise<PasswordAuthResult> {
  const username = normalizeUsername(input.username);
  const name = input.name.normalize("NFKC").trim().replace(/\s+/g, " ");
  if (
    !isValidUsername(username) ||
    !isValidPassword(input.password) ||
    name.length < 2 ||
    name.length > 60
  ) {
    return { ok: false, error: "invalid_fields" };
  }
  if (getUserByUsername(username)) {
    return { ok: false, error: "username_taken" };
  }
  const passwordHash = await hashPassword(input.password);
  let user: User;
  try {
    user = createPasswordUser({
      username,
      password_hash: passwordHash,
      name,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USERNAME_TAKEN") {
      return { ok: false, error: "username_taken" };
    }
    throw error;
  }
  await startSession(user);
  return { ok: true, user };
}

let dummyPasswordHash: Promise<string> | null = null;

function getDummyPasswordHash() {
  dummyPasswordHash ??= hashPassword("dummy-password-for-timing-only");
  return dummyPasswordHash;
}

export async function loginWithPassword(input: {
  username: string;
  password: string;
}): Promise<PasswordAuthResult> {
  const username = normalizeUsername(input.username);
  if (!isValidUsername(username) || !isValidPassword(input.password)) {
    return { ok: false, error: "invalid_credentials" };
  }
  const user = getUserByUsername(username);
  const passwordHash = user?.password_hash || (await getDummyPasswordHash());
  if (!(await verifyPassword(input.password, passwordHash)) || !user?.password_hash) {
    return { ok: false, error: "invalid_credentials" };
  }
  await startSession(user);
  return { ok: true, user };
}

async function startSession(user: User) {
  const session = createSession(user.id);
  const c = await cookies();
  c.set(SESSION_COOKIE, session.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(session.expires_at),
  });
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

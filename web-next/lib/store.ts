/**
 * Атомарный JSON-store для MVP. При масштабировании его заменит SQLite/Postgres.
 * Файлы лежат в data/store/ (вне data/catalog.json — тот генерится sync-ом).
 *
 * Каждая «таблица» — массив объектов в одном файле. Запись через temp+rename
 * для атомарности. Чтение — кеш в памяти + invalidation по mtime.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { STORE_DIR } from "@/lib/paths";

function ensureStore() {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true, mode: 0o700 });
  }
  fs.chmodSync(STORE_DIR, 0o700);
}

function filePath(table: string) {
  return path.join(STORE_DIR, `${table}.json`);
}

function readAll<T>(table: string): T[] {
  ensureStore();
  const p = filePath(table);
  if (!fs.existsSync(p)) return [];
  try {
    fs.chmodSync(p, 0o600);
    const raw = fs.readFileSync(p, "utf-8");
    return JSON.parse(raw) as T[];
  } catch (error) {
    console.error(`[store] failed to read ${p}`, error);
    throw new Error(`Storage table is unreadable: ${table}`, { cause: error });
  }
}

function writeAll<T>(table: string, items: T[]) {
  ensureStore();
  const p = filePath(table);
  const tmp = `${p}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(items, null, 2), {
    encoding: "utf-8",
    mode: 0o600,
  });
  fs.chmodSync(tmp, 0o600);
  fs.renameSync(tmp, p);
  fs.chmodSync(p, 0o600);
}

// ============== users ==============

export type User = {
  id: string;
  /** Старые VK-аккаунты остаются читаемыми, но новый вход — по логину. */
  vk_id?: number | null;
  username?: string | null;
  password_hash?: string | null;
  auth_provider?: "vk" | "password";
  name: string;
  avatar: string | null;
  created_at: string;
};

export type PublicUser = {
  id: string;
  username: string | null;
  name: string;
  avatar: string | null;
};

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    username: user.username ?? null,
    name: user.name,
    avatar: user.avatar,
  };
}

export function getUserByVkId(vkId: number): User | null {
  return readAll<User>("users").find((u) => u.vk_id === vkId) ?? null;
}

export function getUserById(id: string): User | null {
  return readAll<User>("users").find((u) => u.id === id) ?? null;
}

export function getUserByUsername(username: string): User | null {
  return (
    readAll<User>("users").find(
      (user) => user.username?.toLocaleLowerCase("ru-RU") === username
    ) ?? null
  );
}

export function createPasswordUser(input: {
  username: string;
  password_hash: string;
  name: string;
}): User {
  const users = readAll<User>("users");
  if (
    users.some(
      (user) =>
        user.username?.toLocaleLowerCase("ru-RU") === input.username
    )
  ) {
    throw new Error("USERNAME_TAKEN");
  }
  const user: User = {
    id: crypto.randomUUID(),
    vk_id: null,
    username: input.username,
    password_hash: input.password_hash,
    auth_provider: "password",
    name: input.name,
    avatar: null,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  writeAll("users", users);
  return user;
}

export function upsertUser(input: {
  vk_id: number;
  name: string;
  avatar: string | null;
}): User {
  const users = readAll<User>("users");
  const existing = users.find((u) => u.vk_id === input.vk_id);
  if (existing) {
    existing.name = input.name;
    existing.avatar = input.avatar;
    writeAll("users", users);
    return existing;
  }
  const user: User = {
    id: crypto.randomUUID(),
    vk_id: input.vk_id,
    username: null,
    password_hash: null,
    auth_provider: "vk",
    name: input.name,
    avatar: input.avatar,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  writeAll("users", users);
  return user;
}

// ============== favorites ==============

export type Favorite = {
  user_id: string;
  lesson_slug: string;
  created_at: string;
};

export function getFavoritesForUser(userId: string): Favorite[] {
  return readAll<Favorite>("favorites").filter(
    (favorite) => favorite.user_id === userId
  );
}

export function addFavorite(userId: string, lessonSlug: string): Favorite {
  const favorites = readAll<Favorite>("favorites");
  const existing = favorites.find(
    (favorite) =>
      favorite.user_id === userId && favorite.lesson_slug === lessonSlug
  );
  if (existing) return existing;

  const favorite: Favorite = {
    user_id: userId,
    lesson_slug: lessonSlug,
    created_at: new Date().toISOString(),
  };
  favorites.push(favorite);
  writeAll("favorites", favorites);
  return favorite;
}

export function removeFavorite(userId: string, lessonSlug: string) {
  const favorites = readAll<Favorite>("favorites");
  const next = favorites.filter(
    (favorite) =>
      favorite.user_id !== userId || favorite.lesson_slug !== lessonSlug
  );
  if (next.length !== favorites.length) writeAll("favorites", next);
}

// ============== sessions ==============

export type StoredSession = {
  /** Новые записи хранят только SHA-256. token нужен для чтения legacy-файлов. */
  token_hash?: string;
  token?: string;
  user_id: string;
  created_at: string;
  expires_at: string;
};

export type Session = StoredSession & { token: string };

const SESSION_TTL_MS = 30 * 24 * 3600 * 1000; // 30 дней
const MAX_ACTIVE_SESSIONS_PER_USER = 5;

export function createSession(userId: string): Session {
  const sessions = readAll<StoredSession>("sessions").map(normalizeStoredSession);
  const now = Date.now();
  const token = crypto.randomBytes(32).toString("hex");
  const session: Session = {
    token,
    token_hash: hashSessionToken(token),
    user_id: userId,
    created_at: new Date(now).toISOString(),
    expires_at: new Date(now + SESSION_TTL_MS).toISOString(),
  };
  // Попутно подчищаем протухшие и ограничиваем число активных сессий одного
  // пользователя: повторный обмен одного VK-токена не раздувает хранилище.
  const fresh = sessions.filter((session) => {
    const expiresAt = Date.parse(session.expires_at);
    return Number.isFinite(expiresAt) && expiresAt > now;
  });
  const otherUsers = fresh.filter((s) => s.user_id !== userId);
  const userSessions = fresh
    .filter((s) => s.user_id === userId)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
    .slice(-(MAX_ACTIVE_SESSIONS_PER_USER - 1));
  const stored: StoredSession = {
    token_hash: session.token_hash,
    user_id: session.user_id,
    created_at: session.created_at,
    expires_at: session.expires_at,
  };
  writeAll("sessions", [...otherUsers, ...userSessions, stored]);
  return session;
}

export function getSessionByToken(token: string): StoredSession | null {
  if (!token) return null;
  const tokenHash = hashSessionToken(token);
  const session = readAll<StoredSession>("sessions").find(
    (item) => item.token_hash === tokenHash || item.token === token
  );
  if (!session) return null;
  const expiresAt = Date.parse(session.expires_at);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return null;
  return session;
}

export function deleteSession(token: string) {
  const tokenHash = hashSessionToken(token);
  const sessions = readAll<StoredSession>("sessions")
    .filter(
      (session) => session.token_hash !== tokenHash && session.token !== token
    )
    .map(normalizeStoredSession);
  writeAll("sessions", sessions);
}

function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function normalizeStoredSession(session: StoredSession): StoredSession {
  const normalized: StoredSession = {
    user_id: session.user_id,
    created_at: session.created_at,
    expires_at: session.expires_at,
  };
  if (session.token_hash) normalized.token_hash = session.token_hash;
  else if (session.token) normalized.token_hash = hashSessionToken(session.token);
  return normalized;
}

// ============== unlocks ==============

export type Unlock = {
  user_id: string;
  lesson_slug: string;
  type: "subscription" | "admin";
  vk_post_id: string | null;
  created_at: string;
};

export function getUnlocksForUser(userId: string): Unlock[] {
  return readAll<Unlock>("unlocks").filter(
    (u) => u.user_id === userId && isActiveUnlockType(u.type)
  );
}

export function hasUnlock(userId: string, lessonSlug: string): boolean {
  return readAll<Unlock>("unlocks").some(
    (u) =>
      u.user_id === userId &&
      u.lesson_slug === lessonSlug &&
      isActiveUnlockType(u.type)
  );
}

function isActiveUnlockType(type: unknown): type is Unlock["type"] {
  return type === "subscription" || type === "admin";
}

export function addUnlock(input: {
  user_id: string;
  lesson_slug: string;
  type: Unlock["type"];
  vk_post_id?: string | null;
}): Unlock {
  const unlocks = readAll<Unlock>("unlocks");
  // Активную запись не дублируем. Старую share-запись заменяем: она больше не
  // даёт доступ и не должна мешать выдать subscription/admin.
  const existingIndex = unlocks.findIndex(
    (u) => u.user_id === input.user_id && u.lesson_slug === input.lesson_slug
  );
  if (existingIndex >= 0) {
    const existing = unlocks[existingIndex];
    if (isActiveUnlockType(existing.type)) return existing;
    unlocks.splice(existingIndex, 1);
  }
  const unlock: Unlock = {
    user_id: input.user_id,
    lesson_slug: input.lesson_slug,
    type: input.type,
    vk_post_id: input.vk_post_id ?? null,
    created_at: new Date().toISOString(),
  };
  unlocks.push(unlock);
  writeAll("unlocks", unlocks);
  return unlock;
}

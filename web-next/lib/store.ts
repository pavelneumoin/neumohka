/**
 * Атомарный JSON-store для MVP. SQLite/Postgres появятся в Фазе 2 при подключении ЮKassa.
 * Файлы лежат в data/store/ (вне data/catalog.json — тот генерится sync-ом).
 *
 * Каждая «таблица» — массив объектов в одном файле. Запись через temp+rename
 * для атомарности. Чтение — кеш в памяти + invalidation по mtime.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const STORE_DIR = path.join(process.cwd(), "data", "store");

function ensureStore() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
}

function filePath(table: string) {
  return path.join(STORE_DIR, `${table}.json`);
}

function readAll<T>(table: string): T[] {
  ensureStore();
  const p = filePath(table);
  if (!fs.existsSync(p)) return [];
  try {
    const raw = fs.readFileSync(p, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeAll<T>(table: string, items: T[]) {
  ensureStore();
  const p = filePath(table);
  const tmp = `${p}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(items, null, 2), "utf-8");
  fs.renameSync(tmp, p);
}

// ============== users ==============

export type User = {
  id: string;
  vk_id: number;
  name: string;
  avatar: string | null;
  created_at: string;
};

export function getUserByVkId(vkId: number): User | null {
  return readAll<User>("users").find((u) => u.vk_id === vkId) ?? null;
}

export function getUserById(id: string): User | null {
  return readAll<User>("users").find((u) => u.id === id) ?? null;
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
    name: input.name,
    avatar: input.avatar,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  writeAll("users", users);
  return user;
}

// ============== sessions ==============

export type Session = {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
};

const SESSION_TTL_MS = 30 * 24 * 3600 * 1000; // 30 дней

export function createSession(userId: string): Session {
  const sessions = readAll<Session>("sessions");
  const now = Date.now();
  const session: Session = {
    token: crypto.randomBytes(32).toString("hex"),
    user_id: userId,
    created_at: new Date(now).toISOString(),
    expires_at: new Date(now + SESSION_TTL_MS).toISOString(),
  };
  // попутно подчищаем протухшие
  const fresh = sessions.filter(
    (s) => new Date(s.expires_at).getTime() > now
  );
  fresh.push(session);
  writeAll("sessions", fresh);
  return session;
}

export function getSessionByToken(token: string): Session | null {
  if (!token) return null;
  const session = readAll<Session>("sessions").find((s) => s.token === token);
  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) return null;
  return session;
}

export function deleteSession(token: string) {
  const sessions = readAll<Session>("sessions").filter(
    (s) => s.token !== token
  );
  writeAll("sessions", sessions);
}

// ============== unlocks ==============

export type Unlock = {
  user_id: string;
  lesson_slug: string;
  type: "share" | "subscription" | "admin";
  vk_post_id: string | null;
  created_at: string;
};

export function getUnlocksForUser(userId: string): Unlock[] {
  return readAll<Unlock>("unlocks").filter((u) => u.user_id === userId);
}

export function hasUnlock(userId: string, lessonSlug: string): boolean {
  return readAll<Unlock>("unlocks").some(
    (u) => u.user_id === userId && u.lesson_slug === lessonSlug
  );
}

export function addUnlock(input: {
  user_id: string;
  lesson_slug: string;
  type: Unlock["type"];
  vk_post_id?: string | null;
}): Unlock {
  const unlocks = readAll<Unlock>("unlocks");
  // если уже есть — не дублируем
  const existing = unlocks.find(
    (u) => u.user_id === input.user_id && u.lesson_slug === input.lesson_slug
  );
  if (existing) return existing;
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

import crypto from "node:crypto";

const KEY_LENGTH = 64;
const SCRYPT_OPTIONS = {
  N: 32_768,
  r: 8,
  p: 1,
  maxmem: 64 * 1024 * 1024,
} as const;

export function normalizeUsername(value: string) {
  return value.normalize("NFKC").trim().toLocaleLowerCase("ru-RU");
}

export function isValidUsername(value: string) {
  return /^[a-z0-9][a-z0-9._-]{1,30}[a-z0-9]$/.test(value);
}

export function isValidPassword(value: string) {
  const characterCount = Array.from(value).length;
  return (
    characterCount >= 8 &&
    characterCount <= 128 &&
    Buffer.byteLength(value) <= 512
  );
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const derived = await derivePassword(password, salt, KEY_LENGTH, SCRYPT_OPTIONS);
  return [
    "scrypt",
    String(SCRYPT_OPTIONS.N),
    String(SCRYPT_OPTIONS.r),
    String(SCRYPT_OPTIONS.p),
    salt.toString("base64url"),
    derived.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(password: string, encoded: string) {
  try {
    const [algorithm, n, r, p, saltValue, hashValue, extra] = encoded.split("$");
    if (
      algorithm !== "scrypt" ||
      extra !== undefined ||
      Number(n) !== SCRYPT_OPTIONS.N ||
      Number(r) !== SCRYPT_OPTIONS.r ||
      Number(p) !== SCRYPT_OPTIONS.p
    ) {
      return false;
    }
    const salt = Buffer.from(saltValue, "base64url");
    const expected = Buffer.from(hashValue, "base64url");
    if (salt.length !== 16 || expected.length !== KEY_LENGTH) return false;
    const derived = await derivePassword(password, salt, expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: 64 * 1024 * 1024,
    });
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function derivePassword(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: crypto.ScryptOptions
) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

import assert from "node:assert/strict";
import {
  hashPassword,
  isValidPassword,
  isValidUsername,
  normalizeUsername,
  verifyPassword,
} from "../lib/password.ts";
import { safeNextPath } from "../lib/navigation.ts";

const password = "Correct horse 42";
const first = await hashPassword(password);
const second = await hashPassword(password);

assert.notEqual(first, second, "password salts must differ");
assert.equal(first.includes(password), false, "hash must not contain password");
assert.equal(await verifyPassword(password, first), true);
assert.equal(await verifyPassword("wrong password", first), false);
assert.equal(await verifyPassword(password, "broken"), false);
assert.equal(isValidPassword("short"), false);
assert.equal(isValidPassword("😀😀😀😀"), false);
assert.equal(isValidPassword(password), true);
assert.equal(normalizeUsername("  Teacher.One  "), "teacher.one");
assert.equal(isValidUsername("teacher.one"), true);
assert.equal(isValidUsername("ab"), false);
assert.equal(isValidUsername("a"), false);
assert.equal(isValidUsername("учитель"), false);
assert.equal(safeNextPath("/catalog?q=15"), "/catalog?q=15");
assert.equal(safeNextPath("//evil.example"), "/account");
assert.equal(safeNextPath("https://evil.example"), "/account");

console.log("auth core: 16 password, login and redirect checks passed");

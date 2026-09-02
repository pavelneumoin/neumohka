import assert from "node:assert/strict";

const ORIGIN = process.env.TEST_ORIGIN || "http://127.0.0.1:3002";
const seed = `${process.pid}${Date.now().toString(36)}`.slice(-12);
const firstUsername = `qa_${seed}`;
const secondUsername = `qb_${seed}`;
const password = "Reliable test password 42";
const favoriteSlug = "algebra-10-formuly-privedeniya";
let checks = 0;

function check(condition, message) {
  checks += 1;
  assert(condition, message);
}

async function mutation(path, method, body, cookie) {
  return fetch(`${ORIGIN}${path}`, {
    method,
    redirect: "manual",
    headers: {
      Origin: ORIGIN,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(cookie ? { Cookie: cookie } : {}),
      "X-Real-IP": `integration-${seed}`,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

function sessionCookie(response) {
  const value = response.headers.get("set-cookie") || "";
  check(value.includes("nm_session="), "session cookie missing");
  check(/HttpOnly/i.test(value), "session cookie must be HttpOnly");
  check(/SameSite=Lax/i.test(value), "session cookie must be SameSite=Lax");
  check(/Secure/i.test(value), "production session cookie must be Secure");
  return value.split(";", 1)[0];
}

async function register(username, name) {
  const response = await mutation("/api/auth/register", "POST", {
    username,
    password,
    name,
  });
  check(response.status === 201, `register ${username}: ${response.status}`);
  const json = await response.json();
  check(json.user?.username === username, "public username mismatch");
  check(!("password_hash" in json.user), "password hash leaked from register");
  return sessionCookie(response);
}

async function me(cookie) {
  const response = await fetch(`${ORIGIN}/api/auth/me`, {
    headers: cookie ? { Cookie: cookie } : {},
  });
  check(response.status === 200, `me: ${response.status}`);
  return response.json();
}

const firstCookie = await register(firstUsername, "Первый тестовый учитель");
let firstMe = await me(firstCookie);
check(firstMe.user?.username === firstUsername, "registered session not recognized");
check(Array.isArray(firstMe.favorites) && firstMe.favorites.length === 0, "new account favorites not empty");
check(!("password_hash" in firstMe.user), "password hash leaked from me");

for (let attempt = 0; attempt < 2; attempt += 1) {
  const added = await mutation(
    `/api/favorites/${favoriteSlug}`,
    "PUT",
    undefined,
    firstCookie
  );
  check(added.status === 200, `favorite add ${attempt + 1}: ${added.status}`);
}
firstMe = await me(firstCookie);
check(
  firstMe.favorites.filter((slug) => slug === favoriteSlug).length === 1,
  "favorite add must be idempotent"
);

const secondCookie = await register(secondUsername, "Второй тестовый учитель");
const secondMe = await me(secondCookie);
check(secondMe.favorites.length === 0, "favorites leaked between users");

const missing = await mutation(
  "/api/favorites/not-a-real-lesson",
  "PUT",
  undefined,
  firstCookie
);
check(missing.status === 404, `unknown favorite slug: ${missing.status}`);

const logout = await mutation("/api/auth/logout", "POST", undefined, firstCookie);
check(logout.status === 200, `logout: ${logout.status}`);
const afterLogout = await me(firstCookie);
check(afterLogout.user === null, "old session remained active after logout");

const login = await mutation("/api/auth/login", "POST", {
  username: firstUsername.toUpperCase(),
  password,
});
check(login.status === 200, `login: ${login.status}`);
const loginJson = await login.json();
check(!("password_hash" in loginJson.user), "password hash leaked from login");
const reloginCookie = sessionCookie(login);
const persisted = await me(reloginCookie);
check(persisted.favorites.includes(favoriteSlug), "favorite did not persist across sessions");

for (let attempt = 0; attempt < 2; attempt += 1) {
  const removed = await mutation(
    `/api/favorites/${favoriteSlug}`,
    "DELETE",
    undefined,
    reloginCookie
  );
  check(removed.status === 200, `favorite remove ${attempt + 1}: ${removed.status}`);
}
const finalMe = await me(reloginCookie);
check(finalMe.favorites.length === 0, "favorite removal must be idempotent");

console.log(`integration: ${checks} auth, cookie and favorites checks passed`);

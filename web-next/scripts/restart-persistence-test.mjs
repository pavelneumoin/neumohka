import assert from "node:assert/strict";

const ORIGIN = process.env.TEST_ORIGIN || "http://127.0.0.1:3002";
const phase = process.argv[2];
const runId = process.env.QA_RUN_ID || "local";
const username = `restart_${runId}`;
const password = "Restart persistence password 42";
const slug = "algebra-10-formuly-privedeniya";
let checks = 0;

function check(condition, message) {
  checks += 1;
  assert(condition, message);
}

async function mutation(path, method, body, cookie) {
  return fetch(`${ORIGIN}${path}`, {
    method,
    headers: {
      Origin: ORIGIN,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(cookie ? { Cookie: cookie } : {}),
      "X-Real-IP": `restart-${runId}`,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}

function cookie(response) {
  const value = response.headers.get("set-cookie") || "";
  check(value.includes("nm_session="), "session cookie missing");
  return value.split(";", 1)[0];
}

if (phase === "seed") {
  const registered = await mutation("/api/auth/register", "POST", {
    username,
    password,
    name: "Проверка перезапуска",
  });
  check(registered.status === 201, `register before restart: ${registered.status}`);
  const session = cookie(registered);
  const added = await mutation(`/api/favorites/${slug}`, "PUT", undefined, session);
  check(added.status === 200, `favorite before restart: ${added.status}`);
  console.log(`restart seed: ${checks} checks passed`);
} else if (phase === "verify") {
  const loggedIn = await mutation("/api/auth/login", "POST", { username, password });
  check(loggedIn.status === 200, `login after restart: ${loggedIn.status}`);
  const session = cookie(loggedIn);
  const meResponse = await fetch(`${ORIGIN}/api/auth/me`, {
    headers: { Cookie: session },
  });
  check(meResponse.status === 200, `me after restart: ${meResponse.status}`);
  const me = await meResponse.json();
  check(me.user?.username === username, "user did not persist across restart");
  check(me.favorites?.includes(slug), "favorite did not persist across restart");
  const removed = await mutation(`/api/favorites/${slug}`, "DELETE", undefined, session);
  check(removed.status === 200, `cleanup favorite: ${removed.status}`);
  console.log(`restart verify: ${checks} checks passed`);
} else {
  throw new Error("Usage: node scripts/restart-persistence-test.mjs seed|verify");
}

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const sourceUrl = new URL("../lib/vk-auth.ts", import.meta.url);
const source = await readFile(sourceUrl, "utf8");
const { outputText, diagnostics = [] } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: sourceUrl.pathname,
  reportDiagnostics: true,
});

assert.equal(
  diagnostics.length,
  0,
  diagnostics.map((diagnostic) => diagnostic.messageText).join("\n")
);

const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
const {
  isValidVkAccessToken,
  isValidVkId,
  validateVkAccessToken,
} = await import(moduleUrl);

const APP_ID = 123_456;
const USER_ID = 42;
const ACCESS_TOKEN = "vk2.a.valid-test-token";
const quiet = { warn: () => {} };

function jsonResponse(payload, init = {}) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

test("validates the token owner through VK ID user_info", async () => {
  let call;
  const fetchImpl = async (input, init) => {
    call = { input, init };
    return jsonResponse({
      user: {
        user_id: String(USER_ID),
        first_name: "Павел",
        last_name: "Неумоин",
        avatar: "https://example.test/avatar.jpg",
      },
    });
  };

  const result = await validateVkAccessToken(
    ACCESS_TOKEN,
    USER_ID,
    APP_ID,
    { fetchImpl, ...quiet }
  );

  assert.deepEqual(result, {
    ok: true,
    user: {
      id: USER_ID,
      first_name: "Павел",
      last_name: "Неумоин",
      photo_100: "https://example.test/avatar.jpg",
    },
  });
  assert.ok(call);
  const requestUrl = new URL(call.input);
  assert.equal(requestUrl.origin, "https://id.vk.ru");
  assert.equal(requestUrl.pathname, "/oauth2/user_info");
  assert.equal(requestUrl.searchParams.get("client_id"), String(APP_ID));
  assert.equal(requestUrl.searchParams.has("access_token"), false);
  assert.equal(call.init.method, "POST");
  assert.equal(call.init.body.get("access_token"), ACCESS_TOKEN);
});

test("rejects a valid token when VK returns a different owner", async () => {
  const fetchImpl = async () =>
    jsonResponse({ user: { user_id: String(USER_ID + 1) } });

  const result = await validateVkAccessToken(
    ACCESS_TOKEN,
    USER_ID,
    APP_ID,
    { fetchImpl, ...quiet }
  );

  assert.deepEqual(result, { ok: false, reason: "invalid_credentials" });
});

test("separates invalid credentials from transient VK failures", async (t) => {
  await t.test("malformed schema", async () => {
    const fetchImpl = async () => jsonResponse({ response: [] });
    assert.deepEqual(
      await validateVkAccessToken(ACCESS_TOKEN, USER_ID, APP_ID, {
        fetchImpl,
        ...quiet,
      }),
      { ok: false, reason: "provider_unavailable" }
    );
  });

  await t.test("non-success status", async () => {
    const fetchImpl = async () =>
      jsonResponse({ error: "invalid_token" }, { status: 401 });
    assert.deepEqual(
      await validateVkAccessToken(ACCESS_TOKEN, USER_ID, APP_ID, {
        fetchImpl,
        ...quiet,
      }),
      { ok: false, reason: "invalid_credentials" }
    );
  });

  await t.test("provider error status", async () => {
    const fetchImpl = async () =>
      jsonResponse({ error: "rate_limited" }, { status: 429 });
    assert.deepEqual(
      await validateVkAccessToken(ACCESS_TOKEN, USER_ID, APP_ID, {
        fetchImpl,
        ...quiet,
      }),
      { ok: false, reason: "provider_unavailable" }
    );
  });

  await t.test("timeout", async () => {
    const fetchImpl = async (_input, init) =>
      new Promise((_resolve, reject) => {
        init.signal.addEventListener("abort", () => reject(init.signal.reason), {
          once: true,
        });
      });
    assert.deepEqual(
      await validateVkAccessToken(ACCESS_TOKEN, USER_ID, APP_ID, {
        fetchImpl,
        timeoutMs: 5,
        ...quiet,
      }),
      { ok: false, reason: "provider_unavailable" }
    );
  });
});

test("rejects unsafe identifiers and malformed tokens without network access", async () => {
  let calls = 0;
  const fetchImpl = async () => {
    calls += 1;
    return jsonResponse({});
  };

  for (const userId of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(isValidVkId(userId), false);
    assert.deepEqual(
      await validateVkAccessToken(ACCESS_TOKEN, userId, APP_ID, {
        fetchImpl,
        ...quiet,
      }),
      { ok: false, reason: "invalid_credentials" }
    );
  }
  for (const token of ["", " token", "token ", "x".repeat(4_097)]) {
    assert.equal(isValidVkAccessToken(token), false);
    assert.deepEqual(
      await validateVkAccessToken(token, USER_ID, APP_ID, {
        fetchImpl,
        ...quiet,
      }),
      { ok: false, reason: "invalid_credentials" }
    );
  }
  for (const appId of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.deepEqual(
      await validateVkAccessToken(ACCESS_TOKEN, USER_ID, appId, {
        fetchImpl,
        ...quiet,
      }),
      { ok: false, reason: "invalid_credentials" }
    );
  }
  assert.equal(calls, 0);
});

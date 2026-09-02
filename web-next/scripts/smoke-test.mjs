#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL = (process.env.TEST_BASE_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);
const TEST_ORIGIN = new URL(BASE_URL).origin;
const catalog = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data", "catalog.json"), "utf-8")
);

let checks = 0;

function assert(condition, message) {
  checks++;
  if (!condition) throw new Error(message);
}

async function request(urlPath, init) {
  return fetch(`${BASE_URL}${urlPath}`, {
    redirect: "manual",
    signal: AbortSignal.timeout(20_000),
    ...init,
  });
}

async function parallel(items, worker, concurrency = 8) {
  let cursor = 0;
  const runners = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (cursor < items.length) {
        const index = cursor++;
        await worker(items[index], index);
      }
    }
  );
  await Promise.all(runners);
}

const htmlRoutes = [
  "/",
  "/catalog",
  "/catalog?q=%D0%BC%D0%B0%D1%81%D0%BA%D0%B8",
  "/faq",
  "/contacts",
  "/privacy",
  "/login",
  "/signup",
  ...catalog.lessons.map((lesson) => `/lesson/${lesson.slug}`),
];

await parallel(htmlRoutes, async (route) => {
  const response = await request(route);
  assert(response.status === 200, `${route}: expected 200, got ${response.status}`);
  assert(
    response.headers.get("content-type")?.includes("text/html"),
    `${route}: expected HTML`
  );
  const html = await response.text();
  assert(html.includes("<main"), `${route}: main landmark is missing`);
  assert(!html.includes("[Ссылка_на_Donut]"), `${route}: raw content placeholder leaked`);
});

for (const [route, destination] of [
  ["/account", "/login?next=/account"],
  ["/pricing", "/catalog"],
  ["/oferta", "/"],
]) {
  const response = await request(route);
  assert(response.status === 307, `${route}: expected redirect, got ${response.status}`);
  assert(
    response.headers.get("location")?.endsWith(destination),
    `${route}: wrong redirect destination`
  );
}

for (const route of ["/robots.txt", "/sitemap.xml"]) {
  const response = await request(route);
  assert(response.status === 200, `${route}: expected 200`);
}

const missing = await request("/lesson/net-takogo-uroka");
assert(missing.status === 404, `missing lesson: expected 404, got ${missing.status}`);
assert((await missing.text()).includes("Такой страницы нет"), "Russian 404 copy missing");

const fileChecks = [];
for (const lesson of catalog.lessons) {
  for (const type of ["presentation", "worksheet", "answers"]) {
    if (lesson.files[type]) {
      fileChecks.push({ slug: lesson.slug, type, free: lesson.free });
    }
  }
}

await parallel(fileChecks, async ({ slug, type, free }) => {
  const route = `/api/file/${slug}/${type}`;
  const response = await request(route, { method: "HEAD" });
  if (free) {
    assert(response.status === 200, `${route}: expected free HEAD 200, got ${response.status}`);
    assert(response.headers.get("content-type") === "application/pdf", `${route}: not a PDF`);
    assert(Number(response.headers.get("content-length")) > 1000, `${route}: invalid length`);
    assert(response.headers.get("x-content-type-options") === "nosniff", `${route}: nosniff missing`);
  } else {
    assert(
      response.status === 307 || response.status === 308,
      `${route}: expected anonymous redirect, got ${response.status}`
    );
    assert(
      response.headers.get("location")?.includes("reason=login"),
      `${route}: locked redirect reason missing`
    );
  }
});

const sample = fileChecks.find(
  (item) => item.type === "presentation" && item.free
);
assert(Boolean(sample), "catalog has no free presentation sample");
if (sample) {
  const response = await request(`/api/file/${sample.slug}/${sample.type}`);
  assert(response.status === 200, "sample PDF request failed");
  const reader = response.body?.getReader();
  assert(Boolean(reader), "sample PDF stream missing");
  if (reader) {
    const { value } = await reader.read();
    await reader.cancel();
    const signature = new TextDecoder().decode(value?.slice(0, 5));
    assert(signature === "%PDF-", `invalid PDF signature: ${signature}`);
  }

  const inline = await request(
    `/api/file/${sample.slug}/${sample.type}?inline=1`
  );
  assert(inline.status === 200, "inline PDF request failed");
  assert(
    inline.headers.get("content-disposition")?.startsWith("inline;"),
    "inline PDF disposition missing"
  );
  await inline.body?.cancel();

  const partial = await request(`/api/file/${sample.slug}/${sample.type}`, {
    headers: { Range: "bytes=0-1023" },
  });
  assert(partial.status === 206, `PDF range request: got ${partial.status}`);
  assert(partial.headers.get("accept-ranges") === "bytes", "PDF ranges not advertised");
  assert(partial.headers.get("content-length") === "1024", "PDF range length mismatch");
  assert(
    partial.headers.get("content-range")?.startsWith("bytes 0-1023/"),
    "PDF Content-Range missing"
  );
  const partialBody = new Uint8Array(await partial.arrayBuffer());
  assert(partialBody.byteLength === 1024, "PDF partial body length mismatch");
  assert(
    new TextDecoder().decode(partialBody.slice(0, 5)) === "%PDF-",
    "PDF partial body signature mismatch"
  );

  const invalidRange = await request(`/api/file/${sample.slug}/${sample.type}`, {
    headers: { Range: "bytes=999999999-" },
  });
  assert(invalidRange.status === 416, `invalid PDF range: got ${invalidRange.status}`);
}

const publicSlug = catalog.lessons.find((lesson) => lesson.files.presentation)?.slug;
assert(Boolean(publicSlug), "catalog is empty");
if (publicSlug) {
  for (const suffix of [
    "presentation.pdf",
    "presentation%2epdf",
    "presentation%252epdf",
    "presentation.PDF",
  ]) {
    const response = await request(`/library/${publicSlug}/${suffix}`);
    assert(response.status === 404, `public PDF bypass ${suffix}: got ${response.status}`);
  }
}

const invalidType = await request(`/api/file/${publicSlug}/source`);
assert(invalidType.status === 400, `invalid file type: got ${invalidType.status}`);
const unavailable = catalog.lessons
  .flatMap((lesson) =>
    ["presentation", "worksheet", "answers"].map((type) => ({ lesson, type }))
  )
  .find(({ lesson, type }) => !lesson.files[type]);
assert(Boolean(unavailable), "catalog has no unavailable file sample");
const missingFile = await request(
  `/api/file/${unavailable?.lesson.slug}/${unavailable?.type}`
);
assert(missingFile.status === 404, `unavailable file: got ${missingFile.status}`);
const missingApiLesson = await request("/api/file/not-a-lesson/presentation");
assert(missingApiLesson.status === 404, `missing API lesson: got ${missingApiLesson.status}`);

const removedShareGate = await request("/api/share/confirm", { method: "POST" });
assert(removedShareGate.status === 404, `removed share endpoint: got ${removedShareGate.status}`);

const disabledVk = await request("/api/auth/vk/exchange", { method: "POST" });
assert(disabledVk.status === 404, `disabled VK endpoint: got ${disabledVk.status}`);

const registerWithoutOrigin = await request("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{}",
});
assert(registerWithoutOrigin.status === 403, `register without origin: got ${registerWithoutOrigin.status}`);

const textRegister = await request("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "text/plain", Origin: TEST_ORIGIN },
  body: "{}",
});
assert(textRegister.status === 415, `register text body: got ${textRegister.status}`);

const invalidRegister = await request("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: TEST_ORIGIN },
  body: "{}",
});
assert(invalidRegister.status === 400, `invalid register: got ${invalidRegister.status}`);
assert(invalidRegister.headers.get("cache-control")?.includes("no-store"), "register cache policy missing");

const invalidLogin = await request("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: TEST_ORIGIN },
  body: JSON.stringify({ username: "no_such_teacher", password: "not-the-password" }),
});
assert(invalidLogin.status === 401, `invalid login: got ${invalidLogin.status}`);

const oversizedChunk = new TextEncoder().encode("x".repeat(2_048));
const oversizedBody = new ReadableStream({
  start(controller) {
    for (let index = 0; index < 5; index++) controller.enqueue(oversizedChunk);
    controller.close();
  },
});
const oversizedRegister = await request("/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: TEST_ORIGIN,
    "X-Real-IP": `oversized-register-${process.pid}-${Date.now()}`,
  },
  body: oversizedBody,
  duplex: "half",
});
assert(
  oversizedRegister.status === 413,
  `chunked oversized register: got ${oversizedRegister.status}`
);

const rateKey = `smoke-${process.pid}-${Date.now()}`;
for (let attempt = 0; attempt < 12; attempt++) {
  const response = await request("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: TEST_ORIGIN,
      "X-Real-IP": rateKey,
    },
    body: "{}",
  });
  assert(response.status === 400, `register rate pre-limit ${attempt + 1}: got ${response.status}`);
}
const limitedRegister = await request("/api/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: TEST_ORIGIN,
    "X-Real-IP": rateKey,
  },
  body: "{}",
});
assert(limitedRegister.status === 429, `register rate limit: got ${limitedRegister.status}`);
assert(Number(limitedRegister.headers.get("retry-after")) >= 1, "register Retry-After missing");

const anonymousFavorite = await request(
  `/api/favorites/${publicSlug}`,
  { method: "PUT", headers: { Origin: TEST_ORIGIN } }
);
assert(
  anonymousFavorite.status === 401,
  `anonymous favorite: got ${anonymousFavorite.status}`
);

const foreignFavorite = await request(
  `/api/favorites/${publicSlug}`,
  { method: "PUT", headers: { Origin: "https://evil.example" } }
);
assert(foreignFavorite.status === 403, `foreign favorite: got ${foreignFavorite.status}`);

const me = await request("/api/auth/me");
assert(me.status === 200, `/api/auth/me: got ${me.status}`);
assert(me.headers.get("cache-control")?.includes("no-store"), "auth/me cache policy missing");

const logoutWithoutOrigin = await request("/api/auth/logout", { method: "POST" });
assert(logoutWithoutOrigin.status === 403, `/api/auth/logout without origin: got ${logoutWithoutOrigin.status}`);
const logout = await request("/api/auth/logout", {
  method: "POST",
  headers: { Origin: TEST_ORIGIN },
});
assert(logout.status === 200, `/api/auth/logout: got ${logout.status}`);
assert(logout.headers.get("cache-control")?.includes("no-store"), "auth/logout cache policy missing");

for (const bypass of [
  `/private/library/${publicSlug}/presentation.pdf`,
  `/out/library/${publicSlug}/presentation.pdf`,
  `/.next/standalone/private/library/${publicSlug}/presentation.pdf`,
]) {
  const response = await request(bypass);
  assert(response.status === 404, `private-path bypass ${bypass}: got ${response.status}`);
}

const publicPdfs = [];
function scanPublic(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) scanPublic(fullPath);
    else if (entry.name.toLowerCase().endsWith(".pdf")) publicPdfs.push(fullPath);
  }
}
scanPublic(path.join(ROOT, "public"));
assert(publicPdfs.length === 0, `PDF files remain public: ${publicPdfs.length}`);

console.log(
  `[smoke] OK: ${checks} checks, ${htmlRoutes.length} HTML routes, ` +
    `${fileChecks.length} protected file routes`
);

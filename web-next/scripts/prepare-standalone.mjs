#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STANDALONE = path.join(ROOT, ".next", "standalone");

if (!fs.existsSync(STANDALONE)) {
  throw new Error("Standalone build is missing. Run `next build` first.");
}

for (const [source, target] of [
  [path.join(ROOT, "public"), path.join(STANDALONE, "public")],
  [
    path.join(ROOT, ".next", "static"),
    path.join(STANDALONE, ".next", "static"),
  ],
]) {
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(source, target, { recursive: true });
}

console.log("[standalone] public previews and Next static assets copied");

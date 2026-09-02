#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PRIVATE = path.join(ROOT, "private", "library");
const PUBLIC = path.join(ROOT, "public", "library");
const catalog = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data", "catalog.json"), "utf-8")
);
const sourceOverrides = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data", "source-overrides.json"), "utf-8")
);

const referencedPdfs = new Set();
const referencedPreviews = new Set();

function fail(message) {
  console.error(`[data] ${message}`);
  process.exitCode = 1;
}

function signature(filePath, length) {
  const descriptor = fs.openSync(filePath, "r");
  try {
    const buffer = Buffer.alloc(length);
    fs.readSync(descriptor, buffer, 0, length, 0);
    return buffer;
  } finally {
    fs.closeSync(descriptor);
  }
}

const lessonsBySlug = new Map(
  catalog.lessons.map((lesson) => [lesson.slug, lesson])
);
for (const [slug, override] of Object.entries(sourceOverrides)) {
  const lesson = lessonsBySlug.get(slug);
  if (!lesson) {
    fail(`source override references unknown lesson: ${slug}`);
  } else if (typeof override.title === "string" && lesson.title !== override.title) {
    fail(`catalog title differs from durable override: ${slug}`);
  }
}

for (const lesson of catalog.lessons) {
  for (const type of ["presentation", "worksheet", "answers"]) {
    if (!lesson.files[type]) continue;
    const expectedApiPath = `/api/file/${lesson.slug}/${type}`;
    if (lesson.files[type] !== expectedApiPath) {
      fail(
        `unsafe catalog URL for ${lesson.slug}/${type}: ${lesson.files[type]}`
      );
    }
    const filePath = path.join(PRIVATE, lesson.slug, `${type}.pdf`);
    referencedPdfs.add(path.resolve(filePath).toLowerCase());
    if (!fs.existsSync(filePath)) {
      fail(`missing ${lesson.slug}/${type}.pdf`);
      continue;
    }
    if (signature(filePath, 5).toString("ascii") !== "%PDF-") {
      fail(`invalid PDF signature: ${lesson.slug}/${type}.pdf`);
    }
  }

  if (lesson.files.preview) {
    const expectedPreviewPath = `/library/${lesson.slug}/preview.png`;
    if (lesson.files.preview !== expectedPreviewPath) {
      fail(`unexpected preview URL for ${lesson.slug}: ${lesson.files.preview}`);
    }
    const previewPath = path.join(PUBLIC, lesson.slug, "preview.png");
    referencedPreviews.add(path.resolve(previewPath).toLowerCase());
    if (!fs.existsSync(previewPath)) {
      fail(`missing ${lesson.slug}/preview.png`);
    } else if (
      !signature(previewPath, 8).equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
      )
    ) {
      fail(`invalid PNG signature: ${lesson.slug}/preview.png`);
    }
  }
}

function collectFiles(root, predicate) {
  const output = [];
  if (!fs.existsSync(root)) return output;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) output.push(...collectFiles(fullPath, predicate));
    else if (predicate(fullPath)) output.push(fullPath);
  }
  return output;
}

const publicPdfs = collectFiles(PUBLIC, (filePath) =>
  filePath.toLowerCase().endsWith(".pdf")
);
if (publicPdfs.length) fail(`${publicPdfs.length} PDF files remain in public/`);

const privatePdfs = collectFiles(PRIVATE, (filePath) =>
  filePath.toLowerCase().endsWith(".pdf")
);
const orphanPdfs = privatePdfs.filter(
  (filePath) => !referencedPdfs.has(path.resolve(filePath).toLowerCase())
);

const expectedHashes = {
  "algebra-10-formuly-privedeniya/presentation.pdf":
    "D4C13973791FE141413D60D27C77BD8754266E817EAFB5559B777770342CD539",
  "algebra-10-formuly-privedeniya/worksheet.pdf":
    "D73FF4C3D7636148E6FEB5374DAA3FF64C724C7DB88C5EEFAB5EEBC4284B45D1",
};
for (const [relativePath, expected] of Object.entries(expectedHashes)) {
  const filePath = path.join(PRIVATE, relativePath);
  const actual = crypto
    .createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex")
    .toUpperCase();
  if (actual !== expected) fail(`unexpected hash: ${relativePath}`);
}

if (!process.exitCode) {
  console.log(
    `[data] OK: ${catalog.lessons.length} lessons, ` +
      `${referencedPdfs.size} referenced PDFs, ` +
      `${referencedPreviews.size} previews, ${publicPdfs.length} public PDFs`
  );
  if (orphanPdfs.length) {
    const bytes = orphanPdfs.reduce((sum, filePath) => sum + fs.statSync(filePath).size, 0);
    console.log(
      `[data] note: ${orphanPdfs.length} unreferenced PDFs remain private ` +
        `(${(bytes / 1024 / 1024).toFixed(1)} MiB)`
    );
  }
}

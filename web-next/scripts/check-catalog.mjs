#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const catalogPath = path.join(root, "data", "catalog.json");
const freeListPath = path.join(root, "data", "free-lessons.json");
const libraryPath = path.join(root, "public", "library");

const errors = [];
const warnings = [];

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(
      `${label} is not readable JSON: ${error instanceof Error ? error.message : String(error)}`
    );
    return null;
  }
}

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSafeSlug(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9-]*$/.test(value);
}

function hasExactFile(rootPath, segments) {
  let currentPath = rootPath;
  try {
    for (const [index, segment] of segments.entries()) {
      const isLast = index === segments.length - 1;
      const entry = fs
        .readdirSync(currentPath, { withFileTypes: true })
        .find((candidate) => candidate.name === segment);
      if (!entry || (isLast ? !entry.isFile() : !entry.isDirectory())) {
        return false;
      }
      currentPath = path.join(currentPath, segment);
    }
    return true;
  } catch {
    return false;
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

const allowedSubjects = new Set([
  "algebra",
  "geometry",
  "informatics",
  "math",
  "other",
]);
const allowedExams = new Set(["ege", "oge", "demo"]);

function validateClassification(record, label) {
  if (!allowedSubjects.has(record.subject)) {
    errors.push(`${label}.subject is invalid: ${String(record.subject)}`);
  }
  if (
    record.grade !== null &&
    (!Number.isInteger(record.grade) || record.grade < 1 || record.grade > 12)
  ) {
    errors.push(`${label}.grade must be null or an integer from 1 to 12`);
  }
  if (record.exam !== null && !allowedExams.has(record.exam)) {
    errors.push(`${label}.exam is invalid: ${String(record.exam)}`);
  }
}

const catalog = readJson(catalogPath, "data/catalog.json");
const freeList = readJson(freeListPath, "data/free-lessons.json");

const lessons = isRecord(catalog) && Array.isArray(catalog.lessons)
  ? catalog.lessons
  : [];
const sections = isRecord(catalog) && Array.isArray(catalog.sections)
  ? catalog.sections
  : [];

if (lessons.length === 0) errors.push("catalog.lessons must not be empty");
if (sections.length === 0) errors.push("catalog.sections must not be empty");

if (!isRecord(catalog)) {
  errors.push("data/catalog.json must contain an object");
} else {
  if (!Array.isArray(catalog.lessons)) errors.push("catalog.lessons must be an array");
  if (!Array.isArray(catalog.sections)) errors.push("catalog.sections must be an array");
  if (!isRecord(catalog.stats)) errors.push("catalog.stats must be an object");
  if (typeof catalog.generatedAt !== "string" || Number.isNaN(Date.parse(catalog.generatedAt))) {
    errors.push("catalog.generatedAt must be an ISO-compatible timestamp");
  }
}

if (!Array.isArray(freeList) || freeList.some((item) => typeof item !== "string")) {
  errors.push("data/free-lessons.json must contain an array of strings");
}

const sectionSlugs = new Set();
for (const [index, section] of sections.entries()) {
  if (!isRecord(section)) {
    errors.push(`sections[${index}] must be an object`);
    continue;
  }
  if (!isSafeSlug(section.slug)) {
    errors.push(`sections[${index}].slug is unsafe or missing`);
    continue;
  }
  if (sectionSlugs.has(section.slug)) {
    errors.push(`duplicate section slug: ${section.slug}`);
  }
  sectionSlugs.add(section.slug);
  if (!isNonEmptyString(section.title)) {
    errors.push(`section ${section.slug} has an invalid title`);
  }
  validateClassification(section, `section ${section.slug}`);
  if (!Number.isInteger(section.lessonCount) || section.lessonCount < 0) {
    errors.push(`section ${section.slug} has an invalid lessonCount`);
  }
}

const fileRules = {
  presentation: "presentation.pdf",
  worksheet: "worksheet.pdf",
  answers: "answers.pdf",
  preview: "preview.png",
};
const lessonSlugs = new Set();
const sectionCounts = new Map();
const catalogFilesBySlug = new Map();
let freeLessons = 0;

for (const [index, lesson] of lessons.entries()) {
  if (!isRecord(lesson)) {
    errors.push(`lessons[${index}] must be an object`);
    continue;
  }
  const slug = lesson.slug;
  if (!isSafeSlug(slug)) {
    errors.push(`lessons[${index}].slug is unsafe or missing`);
    continue;
  }
  if (lessonSlugs.has(slug)) errors.push(`duplicate lesson slug: ${slug}`);
  lessonSlugs.add(slug);
  const catalogFiles = new Set();
  catalogFilesBySlug.set(slug, catalogFiles);

  if (!isNonEmptyString(lesson.title)) {
    errors.push(`lesson ${slug} has an invalid title`);
  }
  if (!isNonEmptyString(lesson.sectionTitle)) {
    errors.push(`lesson ${slug} has an invalid sectionTitle`);
  }
  validateClassification(lesson, `lesson ${slug}`);
  if (
    !Array.isArray(lesson.breadcrumbs) ||
    lesson.breadcrumbs.some((item) => typeof item !== "string")
  ) {
    errors.push(`lesson ${slug} has invalid breadcrumbs`);
  }
  if (lesson.description !== null && typeof lesson.description !== "string") {
    errors.push(`lesson ${slug} has an invalid description`);
  }

  if (!sectionSlugs.has(lesson.section)) {
    errors.push(`lesson ${slug} references unknown section: ${String(lesson.section)}`);
  } else {
    sectionCounts.set(lesson.section, (sectionCounts.get(lesson.section) ?? 0) + 1);
  }

  if (typeof lesson.free !== "boolean") {
    errors.push(`lesson ${slug} has a non-boolean free flag`);
  } else if (lesson.free) {
    freeLessons += 1;
  }

  if (!isRecord(lesson.files)) {
    errors.push(`lesson ${slug} has an invalid files object`);
    continue;
  }

  for (const [field, fileName] of Object.entries(fileRules)) {
    const reference = lesson.files[field];
    if (reference === null) continue;
    const expected = `/library/${slug}/${fileName}`;
    if (reference !== expected) {
      errors.push(`lesson ${slug} has an unsafe ${field} reference: ${String(reference)}`);
      continue;
    }
    catalogFiles.add(fileName);
    if (!hasExactFile(libraryPath, [slug, fileName])) {
      errors.push(`lesson ${slug} references a missing file: ${expected}`);
    }
  }
}

for (const section of sections) {
  if (!isRecord(section) || !isSafeSlug(section.slug)) continue;
  const actual = sectionCounts.get(section.slug) ?? 0;
  if (section.lessonCount !== actual) {
    errors.push(
      `section ${section.slug} lessonCount is ${String(section.lessonCount)}, expected ${actual}`
    );
  }
}

if (isRecord(catalog) && isRecord(catalog.stats)) {
  if (catalog.stats.lessonsKept !== lessons.length) {
    errors.push(
      `stats.lessonsKept is ${String(catalog.stats.lessonsKept)}, expected ${lessons.length}`
    );
  }
  if (catalog.stats.freeLessons !== freeLessons) {
    errors.push(
      `stats.freeLessons is ${String(catalog.stats.freeLessons)}, expected ${freeLessons}`
    );
  }
  if (
    !Number.isInteger(catalog.stats.lessonsScanned) ||
    catalog.stats.lessonsScanned < lessons.length
  ) {
    errors.push("stats.lessonsScanned must be an integer at least as large as lessonsKept");
  }
  if (!Number.isInteger(catalog.stats.filesCopied) || catalog.stats.filesCopied < 0) {
    errors.push("stats.filesCopied must be a non-negative integer");
  }
}

if (Array.isArray(freeList)) {
  const wildcard = freeList.includes("*");
  const configuredFree = new Set(freeList.filter((slug) => slug !== "*"));
  for (const slug of configuredFree) {
    if (!lessonSlugs.has(slug)) errors.push(`free list references unknown lesson: ${slug}`);
  }
  for (const lesson of lessons) {
    if (!isRecord(lesson) || !isSafeSlug(lesson.slug)) continue;
    const expected = wildcard || configuredFree.has(lesson.slug);
    if (lesson.free !== expected) {
      errors.push(`lesson ${lesson.slug} free flag does not match data/free-lessons.json`);
    }
  }
}

if (!fs.existsSync(libraryPath)) {
  errors.push("public/library is missing");
} else {
  const allowedFileNames = new Set(Object.values(fileRules));
  let orphanDirectoryCount = 0;

  for (const entry of fs.readdirSync(libraryPath, { withFileTypes: true })) {
    if (entry.isSymbolicLink() || !entry.isDirectory()) {
      errors.push(`public/library contains an unsafe top-level entry: ${entry.name}`);
      continue;
    }

    const slug = entry.name;
    const expectedFiles = catalogFilesBySlug.get(slug);
    if (!expectedFiles) orphanDirectoryCount += 1;

    const directoryPath = path.join(libraryPath, slug);
    for (const child of fs.readdirSync(directoryPath, { withFileTypes: true })) {
      if (child.isSymbolicLink() || !child.isFile()) {
        errors.push(`public/library/${slug} contains an unsafe entry: ${child.name}`);
        continue;
      }
      if (!allowedFileNames.has(child.name)) {
        errors.push(`public/library/${slug} contains an unexpected file: ${child.name}`);
        continue;
      }
      if (expectedFiles && !expectedFiles.has(child.name)) {
        errors.push(
          `public/library/${slug}/${child.name} exists but is not referenced by the catalog`
        );
      }
    }
  }

  if (orphanDirectoryCount > 0) {
    warnings.push(
      `${orphanDirectoryCount} library directories are not referenced by the catalog; left untouched`
    );
  }
}

for (const warning of warnings) console.warn(`[verify:data] warning: ${warning}`);

if (errors.length > 0) {
  console.error(`[verify:data] failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `[verify:data] ok: ${lessons.length} lessons, ${sections.length} sections, ${freeLessons} free`
);

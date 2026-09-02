#!/usr/bin/env node
/**
 * Синк уроков из локальной библиотеки в web-next.
 * - Рекурсивно ищет presentation.pdf как маркер «это урок».
 * - Копирует PDF в private/library/{slug}/ (вне публичной статики).
 * - Тащит первые pres-N.png как публичные превью.
 * - Парсит верхнюю папку секции (subject/grade/exam).
 * - Пишет data/catalog.json.
 *
 * По умолчанию строит только план. Применение требует хеш именно этого плана:
 * npm run sync -- --apply --confirm=<plan-hash>
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LIBRARY =
  process.env.NEUMOSHKA_LIBRARY_SOURCE ||
  "E:/YA/YandexDisk/Lessons/library";
const OUT_PUBLIC = path.join(ROOT, "public", "library");
const OUT_PRIVATE = path.join(ROOT, "private", "library");
const OUT_DATA = path.join(ROOT, "data", "catalog.json");
const OVERRIDES_PATH = path.join(ROOT, "data", "source-overrides.json");
const PDFTOPPM = process.env.PDFTOPPM_PATH || "pdftoppm";
const APPLY = process.argv.includes("--apply");
const CONFIRM = process.argv
  .find((arg) => arg.startsWith("--confirm="))
  ?.slice("--confirm=".length);
const INCLUDE_OTHER = process.argv.includes("--include-other");
const ACCEPT_CATALOG_DELTA = process.argv.includes("--accept-catalog-delta");

const SECTION_DEFS = [
  { test: /Алгебра.*?(\d+)\s*класс/i, subject: "algebra", grade: 1 },
  { test: /Геометрия.*?(\d+)\s*класс/i, subject: "geometry", grade: 1 },
  { test: /Информатика.*?(\d+)\s*класс/i, subject: "informatics", grade: 1 },
  { test: /Математика\s*ЕГЭ/i, subject: "math", exam: "ege" },
  { test: /Математика\s*ОГЭ/i, subject: "math", exam: "oge" },
  { test: /Информатика\s*ЕГЭ/i, subject: "informatics", exam: "ege" },
  { test: /Информатика\s*ОГЭ/i, subject: "informatics", exam: "oge" },
  { test: /Демо/i, subject: "other", exam: "demo" },
];

const SUBJECT_LABEL = {
  algebra: "Алгебра",
  geometry: "Геометрия",
  informatics: "Информатика",
  math: "Математика",
  other: "Прочее",
};

const EXAM_LABEL = { ege: "ЕГЭ", oge: "ОГЭ", demo: "Демо" };

const TRANSLIT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
  ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugify(input) {
  const lower = input.toLowerCase();
  let out = "";
  for (const ch of lower) {
    if (TRANSLIT[ch] !== undefined) out += TRANSLIT[ch];
    else if (/[a-z0-9]/.test(ch)) out += ch;
    else if (/[\s\-_./,;:]/.test(ch)) out += "-";
    // прочее (скобки, кавычки и т.д.) — съедаем
  }
  return out
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "lesson";
}

function cleanTitle(name) {
  // убираем нумерующий префикс: "1.", "10_2.", "3.1.", но НЕ "1 задание".
  // ловим только "число + точка/подчёркивание + опциональные ещё цифры" + пробел.
  return name
    .replace(/^\d+[._][\d._]*\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function classifySection(rawName) {
  const cleaned = cleanTitle(rawName);
  for (const def of SECTION_DEFS) {
    const m = cleaned.match(def.test);
    if (m) {
      const out = { subject: def.subject };
      if (def.grade !== undefined) out.grade = parseInt(m[1], 10);
      if (def.exam !== undefined) out.exam = def.exam;
      return { ...out, raw: rawName, clean: cleaned };
    }
  }
  return { subject: "other", raw: rawName, clean: cleaned };
}

function sectionSlug(meta) {
  const parts = [meta.subject];
  if (meta.grade) parts.push(String(meta.grade));
  if (meta.exam) parts.push(meta.exam);
  return parts.join("-");
}

function sectionTitle(meta) {
  const subj = SUBJECT_LABEL[meta.subject] || meta.subject;
  if (meta.grade) return `${subj}, ${meta.grade} класс`;
  if (meta.exam) return `${subj}, ${EXAM_LABEL[meta.exam] || meta.exam}`;
  return subj;
}

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}
function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function readDirSafe(p) {
  try {
    return fs.readdirSync(p);
  } catch {
    return [];
  }
}

const SKIP_SCAN_DIRS = [
  /^node_modules$/i,
  /^\.next$/i,
  /^output$/i,
  /^build$/i,
  /^_build$/i,
  /^_marp$/i,
  /^tmp$/i,
  /^temp$/i,
  /^архив/i,
  /^archive/i,
  /^исходник/i,
  /^редактируем.*исходник/i,
  /^редакци/i,
];

function shouldSkipScanDir(name) {
  return name.startsWith(".") || SKIP_SCAN_DIRS.some((rule) => rule.test(name));
}

function findPresentationDirs(rootDir, maxDepth = 4) {
  // возвращает список { dir, depthRel } где есть presentation.pdf
  const results = [];
  function walk(dir, depth) {
    if (depth > maxDepth) return;
    const entries = readDirSafe(dir);
    if (entries.includes("presentation.pdf")) {
      results.push({ dir, depth });
      // не углубляемся внутрь урока — нет смысла
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry);
      if (shouldSkipScanDir(entry)) continue;
      if (isDir(full)) walk(full, depth + 1);
    }
  }
  walk(rootDir, 0);
  return results;
}

const TECH_DIRS = new Set([
  "презентация",
  "материал",
  "worksheet",
  "wildcat",
  "теория",
  "задачи",
  "ответы",
  "code",
]);

function lessonTitleFromPath(lessonDir, sectionDir) {
  const rel = path.relative(sectionDir, lessonDir).split(path.sep);
  const meaningful = rel.filter(
    (s) => !TECH_DIRS.has(s.toLowerCase().trim())
  );
  if (meaningful.length === 0) return cleanTitle(rel[0] || "");
  if (meaningful.length === 1) return cleanTitle(meaningful[0]);
  const first = cleanTitle(meaningful[0]);
  const last = cleanTitle(meaningful[meaningful.length - 1]);
  if (first === last) return first;
  return `${first} · ${last}`;
}

function findFirstPreview(dirs) {
  for (const d of dirs) {
    const entries = readDirSafe(d);
    const pngs = entries
      .filter((n) => /^pres[-_]?\d+\.png$/i.test(n))
      .map((n) => ({
        name: n,
        num: parseInt(n.match(/(\d+)/)?.[1] || "999", 10),
      }))
      .sort((a, b) => a.num - b.num);
    if (pngs[0]) return path.join(d, pngs[0].name);
  }
  return null;
}

function findFile(dirs, fname) {
  for (const d of dirs) {
    const p = path.join(d, fname);
    if (exists(p)) return p;
  }
  return null;
}

function readPostText(dir) {
  for (const candidate of [
    "Telegram_Public_Post.txt",
    "post.txt",
    "Telegram_Donut_Post.txt",
  ]) {
    const p = path.join(dir, candidate);
    if (exists(p)) {
      try {
        return fs.readFileSync(p, "utf-8").trim();
      } catch {}
    }
  }
  return null;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyIfChanged(src, dst) {
  if (!exists(src)) return false;
  if (exists(dst)) {
    const sa = fs.statSync(src);
    const sb = fs.statSync(dst);
    if (sa.size === sb.size && sa.mtimeMs <= sb.mtimeMs) return false;
  }
  ensureDir(path.dirname(dst));
  fs.copyFileSync(src, dst);
  return true;
}

let pdftoppmAvailable = null;
function hasPdftoppm() {
  if (pdftoppmAvailable !== null) return pdftoppmAvailable;
  const r = spawnSync(PDFTOPPM, ["-v"], { stdio: "ignore" });
  pdftoppmAvailable = r.status === 0 || r.status === 99 || r.error === undefined;
  if (r.error) pdftoppmAvailable = false;
  return pdftoppmAvailable;
}

/** Рендер первой страницы PDF в PNG.
 *  Возвращает true, если файл был сгенерирован (или уже актуален). */
function renderPdfFirstPage(pdfPath, pngPath) {
  if (!exists(pdfPath)) return false;
  // инкрементально: если png новее pdf — пропускаем
  if (exists(pngPath)) {
    const a = fs.statSync(pdfPath);
    const b = fs.statSync(pngPath);
    if (b.mtimeMs >= a.mtimeMs) return true;
  }
  if (!hasPdftoppm()) return false;
  ensureDir(path.dirname(pngPath));
  // pdftoppm пишет с суффиксом "-N.png", поэтому даём prefix без расширения
  const tmpPrefix = pngPath.replace(/\.png$/, "");
  const r = spawnSync(
    PDFTOPPM,
    ["-png", "-r", "100", "-f", "1", "-l", "1", pdfPath, tmpPrefix],
    { stdio: "ignore" }
  );
  if (r.status !== 0) return false;
  // ищем результат: <prefix>-1.png или <prefix>-01.png
  const candidates = [`${tmpPrefix}-1.png`, `${tmpPrefix}-01.png`];
  const generated = candidates.find((p) => exists(p));
  if (!generated) return false;
  fs.renameSync(generated, pngPath);
  return true;
}

function isPreviewCurrent(sourcePath, previewPath) {
  if (!exists(sourcePath) || !exists(previewPath)) return false;
  return fs.statSync(previewPath).mtimeMs >= fs.statSync(sourcePath).mtimeMs;
}

function sourceFingerprint(sourcePath) {
  if (!sourcePath) return null;
  const stat = fs.statSync(sourcePath);
  return {
    path: path.relative(LIBRARY, sourcePath).split(path.sep).join("/"),
    size: stat.size,
    mtimeMs: Math.trunc(stat.mtimeMs),
  };
}

function writeJsonAtomic(targetPath, value) {
  ensureDir(path.dirname(targetPath));
  const tmp = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "utf-8");
  fs.renameSync(tmp, targetPath);
}

function removePublicPdfs(directory) {
  let removed = 0;
  for (const entry of readDirSafe(directory)) {
    const full = path.join(directory, entry);
    if (isDir(full)) {
      removed += removePublicPdfs(full);
    } else if (entry.toLowerCase().endsWith(".pdf")) {
      fs.rmSync(full, { force: true });
      removed++;
    }
  }
  return removed;
}

function main() {
  if (!isDir(LIBRARY)) {
    console.error(`[sync] library not found: ${LIBRARY}`);
    process.exit(1);
  }

  let sourceOverrides = {};
  if (exists(OVERRIDES_PATH)) {
    try {
      sourceOverrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf-8"));
    } catch (error) {
      console.error("[sync] invalid data/source-overrides.json", error);
      process.exit(1);
    }
  }

  const sectionDirs = readDirSafe(LIBRARY)
    .filter((n) => isDir(path.join(LIBRARY, n)))
    .sort((a, b) => a.localeCompare(b, "ru"));

  const sectionsBySlug = new Map();
  const lessons = [];
  const slugSeen = new Map();

  let lessonsScanned = 0;
  const skippedSections = [];

  for (const sectionRaw of sectionDirs) {
    const sectionDir = path.join(LIBRARY, sectionRaw);
    const meta = classifySection(sectionRaw);
    if (meta.subject === "other" && !INCLUDE_OTHER) {
      skippedSections.push(sectionRaw);
      continue;
    }
    const sSlug = sectionSlug(meta);
    const sTitle = sectionTitle(meta);

    if (!sectionsBySlug.has(sSlug)) {
      sectionsBySlug.set(sSlug, {
        slug: sSlug,
        title: sTitle,
        subject: meta.subject,
        grade: meta.grade ?? null,
        exam: meta.exam ?? null,
        rawDirs: [],
      });
    }
    sectionsBySlug.get(sSlug).rawDirs.push(sectionRaw);

    const lessonDirs = findPresentationDirs(sectionDir).sort((a, b) =>
      a.dir.localeCompare(b.dir, "ru")
    );
    for (const { dir } of lessonDirs) {
      lessonsScanned++;
      const cleanLesson = lessonTitleFromPath(dir, sectionDir);

      // slug уникальный в рамках секции
      let baseSlug = `${sSlug}-${slugify(cleanLesson)}`;
      let slug = baseSlug;
      let n = 2;
      while (slugSeen.has(slug)) slug = `${baseSlug}-${n++}`;
      slugSeen.set(slug, dir);

      // ищем файлы рядом с presentation.pdf и в родителе (для wildcat-раскладки)
      const parentDir = path.dirname(dir);
      const searchDirs = parentDir !== sectionDir ? [dir, parentDir] : [dir];
      const lessonOverrides = sourceOverrides[slug] || {};
      const displayTitle =
        typeof lessonOverrides.title === "string" && lessonOverrides.title.trim()
          ? cleanTitle(lessonOverrides.title)
          : cleanLesson;

      const filesOut = {};
      const sources = {};
      for (const [field, fname] of [
        ["presentation", "presentation.pdf"],
        ["worksheet", "worksheet.pdf"],
        ["answers", "answers.pdf"],
      ]) {
        const override = lessonOverrides[field];
        const src = override
          ? path.resolve(dir, override)
          : findFile(searchDirs, fname);
        if (src && !exists(src)) {
          console.error(`[sync] override not found for ${slug}/${field}: ${src}`);
          process.exit(1);
        }
        sources[field] = src || null;
        filesOut[field] = src ? `/api/file/${slug}/${field}` : null;
      }

      // preview: сначала готовый pres-N.png, иначе первая страница presentation.pdf
      const previewSrc = lessonOverrides.preview
        ? path.resolve(dir, lessonOverrides.preview)
        : findFirstPreview(searchDirs);
      if (previewSrc && !exists(previewSrc)) {
        console.error(`[sync] override not found for ${slug}/preview: ${previewSrc}`);
        process.exit(1);
      }
      sources.preview = previewSrc || sources.presentation;
      sources.previewFromPdf = !previewSrc && Boolean(sources.presentation);
      filesOut.preview = sources.preview
        ? `/library/${slug}/preview.png`
        : null;

      // post.txt тоже может лежать в parent
      const description =
        readPostText(dir) || (parentDir !== sectionDir ? readPostText(parentDir) : null);

      // breadcrumbs от section до title (без самой папки с presentation.pdf если она техническая)
      const relPath = path.relative(sectionDir, dir).split(path.sep);
      const titleIdx = relPath.findIndex(
        (s) => !TECH_DIRS.has(s.toLowerCase().trim())
      );
      const breadcrumbs =
        titleIdx > 0 ? relPath.slice(0, titleIdx) : relPath.slice(0, -1);

      lessons.push({
        slug,
        // Редакторский title применяется после slug: исправление подписи не
        // ломает существующие ссылки и сохранённое избранное.
        title: displayTitle,
        section: sSlug,
        sectionTitle: sTitle,
        subject: meta.subject,
        grade: meta.grade ?? null,
        exam: meta.exam ?? null,
        breadcrumbs,
        files: filesOut,
        description,
        // free выставляется отдельно через free-list (см. data/free-lessons.json)
        free: false,
        _sources: sources,
      });
    }
  }

  // free-flag: пометить уроки из data/free-lessons.json (если есть).
  // Спецзначение "*" — все уроки бесплатные (на этапе бета-доступа).
  const freeListPath = path.join(ROOT, "data", "free-lessons.json");
  let freeList = [];
  if (exists(freeListPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(freeListPath, "utf-8"));
      if (Array.isArray(parsed)) freeList = parsed;
    } catch {}
  }
  const freeAll = freeList.includes("*");
  const freeSet = new Set(freeList);
  for (const l of lessons) if (freeAll || freeSet.has(l.slug)) l.free = true;

  // сортировка: секция → тема (по slug)
  lessons.sort((a, b) => {
    if (a.section !== b.section) return a.section.localeCompare(b.section);
    return a.title.localeCompare(b.title, "ru");
  });

  const sections = Array.from(sectionsBySlug.values())
    .map((s) => {
      const lessonsInSection = lessons.filter((l) => l.section === s.slug);
      return {
        slug: s.slug,
        title: s.title,
        subject: s.subject,
        grade: s.grade,
        exam: s.exam,
        lessonCount: lessonsInSection.length,
      };
    })
    .filter((s) => s.lessonCount > 0)
    .sort((a, b) => a.title.localeCompare(b.title, "ru"));

  const catalogLessons = lessons.map((lesson) => {
    const catalogLesson = { ...lesson };
    delete catalogLesson._sources;
    return catalogLesson;
  });
  const existingCatalog = exists(OUT_DATA)
    ? JSON.parse(fs.readFileSync(OUT_DATA, "utf-8"))
    : { lessons: [] };
  const existingSlugs = new Set(
    Array.isArray(existingCatalog.lessons)
      ? existingCatalog.lessons.map((lesson) => lesson.slug)
      : []
  );
  const nextSlugs = new Set(catalogLessons.map((lesson) => lesson.slug));
  const added = [...nextSlugs].filter((slug) => !existingSlugs.has(slug));
  const removedSlugs = [...existingSlugs].filter((slug) => !nextSlugs.has(slug));
  const plan = {
    sections,
    lessons: catalogLessons,
    sources: lessons.map((lesson) => ({
      slug: lesson.slug,
      presentation: sourceFingerprint(lesson._sources.presentation),
      worksheet: sourceFingerprint(lesson._sources.worksheet),
      answers: sourceFingerprint(lesson._sources.answers),
      preview: sourceFingerprint(lesson._sources.preview),
      previewFromPdf: lesson._sources.previewFromPdf,
    })),
  };
  const planHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(plan))
    .digest("hex")
    .slice(0, 16);

  console.log(`[sync] plan: ${planHash}`);
  console.log(`[sync] scanned/kept: ${lessonsScanned}/${lessons.length}`);
  console.log(`[sync] sections: ${sections.length}`);
  console.log(`[sync] catalog delta: +${added.length} / -${removedSlugs.length}`);
  if (added.length) console.log(`[sync] add: ${added.join(", ")}`);
  if (removedSlugs.length) console.log(`[sync] remove: ${removedSlugs.join(", ")}`);
  if (skippedSections.length) {
    console.log(`[sync] skipped unclassified sections: ${skippedSections.length}`);
  }

  const confirmCommand =
    `npm run sync -- --apply --confirm=${planHash}` +
    (INCLUDE_OTHER ? " --include-other" : "") +
    (ACCEPT_CATALOG_DELTA ? " --accept-catalog-delta" : "");
  const hasCatalogDelta = added.length > 0 || removedSlugs.length > 0;
  if (!APPLY) {
    console.log("[sync] dry run only; no files were changed.");
    if (hasCatalogDelta && !ACCEPT_CATALOG_DELTA) {
      console.error(
        "[sync] apply is blocked: discovery would change catalog membership. " +
          "Review/fix the source manifest first."
      );
      console.error(
        "[sync] deliberate replacement additionally requires --accept-catalog-delta."
      );
    } else {
      console.log(`[sync] review the plan, then run: ${confirmCommand}`);
    }
    return;
  }
  if (hasCatalogDelta && !ACCEPT_CATALOG_DELTA) {
    console.error(
      "[sync] stopped before writes: catalog delta requires --accept-catalog-delta."
    );
    process.exit(2);
  }
  if (CONFIRM !== planHash) {
    console.error("[sync] confirmation is missing or does not match this plan.");
    console.error(`[sync] run: ${confirmCommand}`);
    process.exit(2);
  }

  // Проверяем генератор превью до первой записи, чтобы не получить полусинк.
  const needsPdfRender = lessons.some((lesson) => {
    if (!lesson._sources.previewFromPdf || !lesson._sources.preview) return false;
    const dst = path.join(OUT_PUBLIC, lesson.slug, "preview.png");
    return !isPreviewCurrent(lesson._sources.preview, dst);
  });
  if (needsPdfRender && !hasPdftoppm()) {
    console.error(`[sync] pdftoppm is required; set PDFTOPPM_PATH (current: ${PDFTOPPM})`);
    process.exit(1);
  }

  ensureDir(OUT_PUBLIC);
  ensureDir(OUT_PRIVATE);
  let copiedFiles = 0;
  for (const lesson of lessons) {
    const privateDir = path.join(OUT_PRIVATE, lesson.slug);
    const publicDir = path.join(OUT_PUBLIC, lesson.slug);
    for (const [field, fname] of [
      ["presentation", "presentation.pdf"],
      ["worksheet", "worksheet.pdf"],
      ["answers", "answers.pdf"],
    ]) {
      const source = lesson._sources[field];
      const destination = path.join(privateDir, fname);
      if (source) {
        if (copyIfChanged(source, destination)) copiedFiles++;
      } else if (exists(destination)) {
        fs.rmSync(destination, { force: true });
      }
    }

    const previewSource = lesson._sources.preview;
    const previewDestination = path.join(publicDir, "preview.png");
    if (!previewSource) {
      if (exists(previewDestination)) fs.rmSync(previewDestination, { force: true });
    } else if (lesson._sources.previewFromPdf) {
      const wasCurrent = isPreviewCurrent(previewSource, previewDestination);
      if (!wasCurrent && !renderPdfFirstPage(previewSource, previewDestination)) {
        console.error(`[sync] failed to render preview for ${lesson.slug}`);
        process.exit(1);
      }
      if (!wasCurrent) copiedFiles++;
    } else if (copyIfChanged(previewSource, previewDestination)) {
      copiedFiles++;
    }
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    sections,
    lessons: catalogLessons,
    stats: {
      lessonsScanned,
      lessonsKept: lessons.length,
      filesCopied: copiedFiles,
      freeLessons: lessons.filter((l) => l.free).length,
    },
  };

  writeJsonAtomic(OUT_DATA, catalog);

  // Чистим только после подтверждённого плана и успешной записи каталога.
  const liveSlugs = new Set(lessons.map((l) => l.slug));
  let removed = 0;
  for (const root of [OUT_PUBLIC, OUT_PRIVATE]) {
    for (const entry of readDirSafe(root)) {
      const full = path.join(root, entry);
      if (isDir(full) && !liveSlugs.has(entry)) {
        fs.rmSync(full, { recursive: true, force: true });
        removed++;
      }
    }
  }
  const removedPublicPdfs = removePublicPdfs(OUT_PUBLIC);

  console.log(`[sync] applied plan: ${planHash}`);
  console.log(`[sync] files copied: ${copiedFiles}`);
  console.log(`[sync] stale public/private dirs removed: ${removed}`);
  console.log(`[sync] public PDFs removed: ${removedPublicPdfs}`);
  console.log(`[sync] free lessons: ${catalog.stats.freeLessons}`);
  console.log(`[sync] catalog → ${path.relative(ROOT, OUT_DATA)}`);
}

main();

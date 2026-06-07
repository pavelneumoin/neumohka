#!/usr/bin/env node
/**
 * Синк уроков из E:/YA/YandexDisk/Lessons/library/ в web-next.
 * - Рекурсивно ищет presentation.pdf как маркер «это урок».
 * - Копирует presentation/worksheet/answers PDF в public/library/{slug}/.
 * - Тащит первые pres-N.png как превью.
 * - Парсит верхнюю папку секции (subject/grade/exam).
 * - Пишет data/catalog.json.
 *
 * Запуск: node scripts/sync-library.mjs
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LIBRARY = "E:/YA/YandexDisk/Lessons/library";
const OUT_PUBLIC = path.join(ROOT, "public", "library");
const OUT_DATA = path.join(ROOT, "data", "catalog.json");

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
      if (entry.startsWith(".") || entry === "node_modules") continue;
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

function findFirst(dir, predicate) {
  const entries = readDirSafe(dir);
  return entries.find(predicate) || null;
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
  const r = spawnSync("pdftoppm", ["-v"], { stdio: "ignore" });
  pdftoppmAvailable = r.status === 0 || r.status === 99 || r.error === undefined;
  if (r.error) pdftoppmAvailable = false;
  return pdftoppmAvailable;
}

/** Рендер первой страницы PDF в PNG.
 *  Возвращает true, если файл был сгенерирован (или уже актуален). */
function renderPdfFirstPage(pdfPath, pngPath) {
  if (!exists(pdfPath)) return false;
  if (!hasPdftoppm()) return false;
  // инкрементально: если png новее pdf — пропускаем
  if (exists(pngPath)) {
    const a = fs.statSync(pdfPath);
    const b = fs.statSync(pngPath);
    if (b.mtimeMs >= a.mtimeMs) return false;
  }
  ensureDir(path.dirname(pngPath));
  // pdftoppm пишет с суффиксом "-N.png", поэтому даём prefix без расширения
  const tmpPrefix = pngPath.replace(/\.png$/, "");
  const r = spawnSync(
    "pdftoppm",
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

function main() {
  if (!isDir(LIBRARY)) {
    console.error(`[sync] library not found: ${LIBRARY}`);
    process.exit(1);
  }

  ensureDir(path.dirname(OUT_DATA));
  ensureDir(OUT_PUBLIC);

  const sectionDirs = readDirSafe(LIBRARY).filter((n) =>
    isDir(path.join(LIBRARY, n))
  );

  const sectionsBySlug = new Map();
  const lessons = [];
  const slugSeen = new Map();

  let copiedFiles = 0;
  let lessonsScanned = 0;

  for (const sectionRaw of sectionDirs) {
    const sectionDir = path.join(LIBRARY, sectionRaw);
    const meta = classifySection(sectionRaw);
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

    const lessonDirs = findPresentationDirs(sectionDir, 4);
    for (const { dir } of lessonDirs) {
      lessonsScanned++;
      const cleanLesson = lessonTitleFromPath(dir, sectionDir);

      // slug уникальный в рамках секции
      let baseSlug = `${sSlug}-${slugify(cleanLesson)}`;
      let slug = baseSlug;
      let n = 2;
      while (slugSeen.has(slug)) slug = `${baseSlug}-${n++}`;
      slugSeen.set(slug, dir);

      const dstDir = path.join(OUT_PUBLIC, slug);

      // ищем файлы рядом с presentation.pdf и в родителе (для wildcat-раскладки)
      const parentDir = path.dirname(dir);
      const searchDirs = parentDir !== sectionDir ? [dir, parentDir] : [dir];

      const filesOut = {};
      for (const [field, fname] of [
        ["presentation", "presentation.pdf"],
        ["worksheet", "worksheet.pdf"],
        ["answers", "answers.pdf"],
      ]) {
        const src = findFile(searchDirs, fname);
        if (src) {
          const dst = path.join(dstDir, fname);
          if (copyIfChanged(src, dst)) copiedFiles++;
          filesOut[field] = `/library/${slug}/${fname}`;
        } else {
          filesOut[field] = null;
        }
      }

      // preview: сначала готовый pres-N.png, иначе генерим из presentation.pdf
      const previewDst = path.join(dstDir, "preview.png");
      const previewSrc = findFirstPreview(searchDirs);
      let previewReady = false;
      if (previewSrc) {
        if (copyIfChanged(previewSrc, previewDst)) copiedFiles++;
        previewReady = true;
      } else if (filesOut.presentation) {
        // присылаем pdftoppm на оригинальный pdf
        const pdfSrc = findFile(searchDirs, "presentation.pdf");
        if (pdfSrc && renderPdfFirstPage(pdfSrc, previewDst)) {
          copiedFiles++;
          previewReady = true;
        } else if (exists(previewDst)) {
          // прежняя сгенерированная версия ещё актуальна
          previewReady = true;
        }
      }
      filesOut.preview = previewReady ? `/library/${slug}/preview.png` : null;

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
        title: cleanLesson,
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

  const catalog = {
    generatedAt: new Date().toISOString(),
    sections,
    lessons,
    stats: {
      lessonsScanned,
      lessonsKept: lessons.length,
      filesCopied: copiedFiles,
      freeLessons: lessons.filter((l) => l.free).length,
    },
  };

  fs.writeFileSync(OUT_DATA, JSON.stringify(catalog, null, 2), "utf-8");

  // чистим устаревшие папки в public/library/
  const liveSlugs = new Set(lessons.map((l) => l.slug));
  let removed = 0;
  for (const entry of readDirSafe(OUT_PUBLIC)) {
    const full = path.join(OUT_PUBLIC, entry);
    if (isDir(full) && !liveSlugs.has(entry)) {
      fs.rmSync(full, { recursive: true, force: true });
      removed++;
    }
  }

  console.log(`[sync] scanned: ${lessonsScanned}`);
  console.log(`[sync] kept lessons: ${lessons.length}`);
  console.log(`[sync] sections: ${sections.length}`);
  console.log(`[sync] files copied: ${copiedFiles}`);
  console.log(`[sync] stale dirs removed: ${removed}`);
  console.log(`[sync] free lessons: ${catalog.stats.freeLessons}`);
  console.log(`[sync] catalog → ${path.relative(ROOT, OUT_DATA)}`);
}

main();

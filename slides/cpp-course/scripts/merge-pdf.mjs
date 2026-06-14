// Собирает единые PDF-сборники всего курса:
//   dist/cpp-course-slides.pdf      — вступление + все слайды уроков по порядку
//   dist/cpp-course-worksheets.pdf  — все рабочие листы и шпаргалки по порядку
// Запуск: node scripts/merge-pdf.mjs   (после сборки PDF уроков)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument } from 'pdf-lib';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const lessons = fs
  .readdirSync(path.join(root, 'lessons'))
  .filter((d) => fs.existsSync(path.join(root, 'lessons', d, 'lesson.pdf')))
  .sort();

async function merge(files, outName) {
  const out = await PDFDocument.create();
  let added = 0;
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const src = await PDFDocument.load(fs.readFileSync(f));
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
    added++;
  }
  const distDir = path.join(root, 'dist');
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, outName), await out.save());
  console.log(`📚 ${outName}: ${added} файлов, ${out.getPageCount()} страниц`);
}

const slideFiles = [
  path.join(root, 'cpp-course.pdf'), // вступительная презентация курса
  ...lessons.map((d) => path.join(root, 'lessons', d, 'lesson.pdf')),
];
const sheetFiles = lessons.flatMap((d) => [
  path.join(root, 'lessons', d, 'worksheet.pdf'),
  path.join(root, 'lessons', d, 'cheatsheet.pdf'),
]);
const answerFiles = lessons.map((d) => path.join(root, 'lessons', d, 'answers.pdf'));

await merge(slideFiles, 'cpp-course-slides.pdf');
await merge(sheetFiles, 'cpp-course-worksheets.pdf');
if (answerFiles.some((f) => fs.existsSync(f))) {
  await merge(answerFiles, 'cpp-course-answers.pdf');
}

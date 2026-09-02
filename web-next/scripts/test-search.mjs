import assert from "node:assert/strict";
import fs from "node:fs";
import { rankLessons } from "../lib/search.ts";

const catalog = JSON.parse(
  fs.readFileSync(new URL("../data/catalog.json", import.meta.url), "utf8")
);
const lessons = catalog.lessons;

function slugs(query) {
  return rankLessons(lessons, query).map((lesson) => lesson.slug);
}

assert.equal(slugs("").length, 62, "empty query keeps the full catalog");
assert.deepEqual(slugs(""), lessons.map((lesson) => lesson.slug));
assert.equal(slugs("формулы прив")[0], "algebra-10-formuly-privedeniya");
assert.ok(slugs("триганометрические")[0].includes("trigonometricheskie"));
assert.ok(slugs("тригноометрические")[0].includes("trigonometricheskie"));
assert.ok(slugs("nhbujyjvtnhbz")[0].includes("trigonometricheskie"));
assert.equal(
  slugs("задание 15 информатика")[0],
  "informatics-ege-15-zadanie-ege-informatika-ege-15-segments-presentation"
);
assert.equal(slugs("ЕГЭ 18 параметр").length, 2);
assert.equal(slugs("cos")[0], "algebra-10-grafik-funkcii-ycosx");
assert.equal(slugs("15").length, 3, "numbers must match exactly");
assert.ok(slugs("рабочий лист").length > 0, "worksheet search must find lessons");
assert.ok(
  rankLessons(lessons, "рабочий лист").every((lesson) => lesson.files.worksheet),
  "material search must return only lessons with worksheets"
);
assert.ok(slugs("trigonometriya").length > 0, "Russian transliteration must work");
assert.ok(slugs("matematika").length > 0, "subject transliteration must work");
assert.ok(slugs("geometriya").length > 0, "geometry transliteration must work");
for (const query of [
  "урок по тригонометрии",
  "материалы по тригонометрии",
  "презентация по тригонометрии",
  "урок про формулы приведения",
  "задание по информатике 15",
  "рабочий лист по формулам приведения",
  "урок по теме тригонометрия",
  "материалы на тему формулы приведения",
]) {
  assert.ok(slugs(query).length > 0, `natural query must work: ${query}`);
}

console.log("search: 22 smart-query checks passed");

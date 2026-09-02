import type { Lesson } from "./catalog";

const EN_KEYS = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`";
const RU_KEYS = "йцукенгшщзхъфывапролджэячсмитьбюё";

const ALIAS_GROUPS = [
  ["информатика", "informatika", "informatics", "инф"],
  ["математика", "matematika", "math"],
  ["алгебра", "algebra"],
  ["геометрия", "geometriya", "geometriia", "geometry"],
  [
    "тригонометрия",
    "тригонометрии",
    "тригонометрический",
    "тригонометрические",
    "тригонометрических",
    "trigonometriya",
    "trigonometriia",
    "trigonometry",
  ],
  ["уравнение", "уравнения", "uravnenie", "uravneniya"],
  ["егэ", "ege"],
  ["огэ", "oge"],
  ["тангенс", "tg", "tan"],
  ["котангенс", "ctg", "cot"],
  ["косинус", "cos"],
  ["синус", "sin"],
  ["фипи", "fipi"],
  ["питон", "python"],
  ["номер", "задание"],
  ["презентация", "слайды", "presentation"],
  ["лист", "worksheet"],
  ["ответы", "answers"],
] as const;

const QUERY_STOP_WORDS = new Set([
  "по",
  "про",
  "для",
  "на",
  "в",
  "во",
  "из",
  "к",
  "ко",
  "и",
  "или",
  "с",
  "со",
  "о",
  "об",
  "урок",
  "материал",
  "тема",
  "тем",
  "теме",
  "тему",
]);

const ALIASES = new Map<string, string>();
for (const group of ALIAS_GROUPS) {
  for (const item of group) ALIASES.set(item, group[0]);
}

const SUBJECT_WORDS: Record<Lesson["subject"], string> = {
  algebra: "алгебра algebra математика math",
  geometry: "геометрия geometry математика math",
  informatics: "информатика informatika informatics инф",
  math: "математика math",
  other: "другое материалы",
};

export function normalizeSearchText(value: string) {
  return value
    .replace(/№\s*(\d+)/gu, " задание $1 ")
    .normalize("NFKC")
    .toLocaleLowerCase("ru-RU")
    .replaceAll("ё", "е")
    .replace(/\bno\s*(\d+)/gu, " задание $1 ")
    .replace(/[+]/gu, " плюс ")
    .replace(/[^a-zа-я0-9]+/giu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function switchEnglishKeyboardToRussian(value: string) {
  let converted = "";
  let changed = false;
  for (const character of value.toLocaleLowerCase("ru-RU")) {
    const index = EN_KEYS.indexOf(character);
    if (index >= 0) {
      converted += RU_KEYS[index];
      changed = true;
    } else {
      converted += character;
    }
  }
  return changed ? converted : value;
}

export function rankLessons(lessons: Lesson[], query: string): Lesson[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return lessons;

  const switched = normalizeSearchText(switchEnglishKeyboardToRussian(query));
  const queries = switched && switched !== normalized ? [normalized, switched] : [normalized];

  return lessons
    .map((lesson, index) => ({
      lesson,
      index,
      score: Math.max(...queries.map((candidate) => scoreLesson(lesson, candidate))),
    }))
    .filter((item) => Number.isFinite(item.score))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map((item) => item.lesson);
}

function scoreLesson(lesson: Lesson, query: string) {
  const queryTokens = tokens(query).filter(
    (token) => !QUERY_STOP_WORDS.has(canonical(token))
  );
  if (queryTokens.length === 0) return 0;

  const title = normalizeSearchText(lesson.title);
  const fields = [
    { value: title, weight: 70 },
    { value: normalizeSearchText(lesson.sectionTitle), weight: 45 },
    {
      value: normalizeSearchText(
        `${SUBJECT_WORDS[lesson.subject]} ${lesson.exam ?? ""} ${lesson.grade ? `${lesson.grade} класс` : ""}`
      ),
      weight: 38,
    },
    { value: normalizeSearchText(lesson.breadcrumbs.join(" ")), weight: 24 },
    {
      value: normalizeSearchText(
        [
          lesson.files.presentation && "презентация слайды presentation",
          lesson.files.worksheet && "рабочий лист worksheet",
          lesson.files.answers && "ответы answers",
        ]
          .filter(Boolean)
          .join(" ")
      ),
      weight: 30,
    },
    { value: normalizeSearchText(lesson.slug), weight: 18 },
  ];

  let total = 0;
  for (const queryToken of queryTokens) {
    let best = 0;
    for (const field of fields) {
      for (const fieldToken of tokens(field.value)) {
        best = Math.max(best, matchToken(queryToken, fieldToken) * field.weight);
      }
    }
    if (best === 0) return Number.NEGATIVE_INFINITY;
    total += best;
  }

  if (title === query) total += 220;
  else if (title.includes(query)) total += 160;
  if (title.startsWith(query)) total += 110;
  if (containsTokensInOrder(tokens(title), queryTokens)) total += 30;
  return total;
}

function tokens(value: string) {
  return normalizeSearchText(value).split(" ").filter(Boolean);
}

function canonical(token: string) {
  return ALIASES.get(token) ?? stemRussian(token);
}

function matchToken(queryToken: string, fieldToken: string) {
  if (/^\d+$/.test(queryToken) || /^\d+$/.test(fieldToken)) {
    return queryToken === fieldToken ? 1 : 0;
  }
  if (queryToken === fieldToken) return 1;
  if (
    Math.min(queryToken.length, fieldToken.length) >= 3 &&
    (fieldToken.startsWith(queryToken) || queryToken.startsWith(fieldToken))
  ) {
    return 0.88;
  }
  const rawFuzzy = fuzzyMatch(queryToken, fieldToken);
  const query = canonical(queryToken);
  const field = canonical(fieldToken);
  if (query === field) {
    return Math.max(rawFuzzy, queryToken === fieldToken ? 1 : 0.9);
  }
  if (
    Math.min(query.length, field.length) >= 3 &&
    (field.startsWith(query) || query.startsWith(field))
  ) {
    return Math.max(rawFuzzy, 0.82);
  }
  return Math.max(rawFuzzy, fuzzyMatch(query, field));
}

function fuzzyMatch(query: string, field: string) {
  if (query.length <= 3 || field.length <= 3) return 0;
  const limit = Math.max(query.length, field.length) <= 5 ? 1 : 2;
  const distance = damerauLevenshtein(query, field, limit);
  if (distance > limit) return 0;
  return distance === 1 ? 0.68 : 0.55;
}

function stemRussian(token: string) {
  if (token.length < 5 || !/[а-я]/u.test(token)) return token;
  const endings = [
    "иями",
    "ями",
    "ами",
    "ого",
    "ему",
    "ими",
    "ыми",
    "ая",
    "яя",
    "ое",
    "ее",
    "ий",
    "ый",
    "ой",
    "ов",
    "ев",
    "ам",
    "ям",
    "ах",
    "ях",
    "у",
    "ю",
    "а",
    "я",
    "ы",
    "и",
  ];
  for (const ending of endings) {
    if (token.endsWith(ending) && token.length - ending.length >= 4) {
      return token.slice(0, -ending.length);
    }
  }
  return token;
}

function containsTokensInOrder(source: string[], query: string[]) {
  let cursor = 0;
  for (const token of source) {
    if (matchToken(query[cursor], token) > 0) cursor += 1;
    if (cursor === query.length) return true;
  }
  return false;
}

function damerauLevenshtein(left: string, right: string, limit: number) {
  if (Math.abs(left.length - right.length) > limit) return limit + 1;
  const matrix = Array.from({ length: left.length + 1 }, () =>
    new Array<number>(right.length + 1).fill(0)
  );
  for (let i = 0; i <= left.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= right.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= left.length; i += 1) {
    let rowMin = limit + 1;
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
      if (
        i > 1 &&
        j > 1 &&
        left[i - 1] === right[j - 2] &&
        left[i - 2] === right[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
      rowMin = Math.min(rowMin, matrix[i][j]);
    }
    if (rowMin > limit) return limit + 1;
  }
  return matrix[left.length][right.length];
}

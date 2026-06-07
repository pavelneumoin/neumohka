import catalogData from "@/data/catalog.json";

export type Subject =
  | "algebra"
  | "geometry"
  | "informatics"
  | "math"
  | "other";
export type Exam = "ege" | "oge" | "demo";

export type Lesson = {
  slug: string;
  title: string;
  section: string;
  sectionTitle: string;
  subject: Subject;
  grade: number | null;
  exam: Exam | null;
  breadcrumbs: string[];
  files: {
    presentation: string | null;
    worksheet: string | null;
    answers: string | null;
    preview: string | null;
  };
  description: string | null;
  free: boolean;
};

export type Section = {
  slug: string;
  title: string;
  subject: Subject;
  grade: number | null;
  exam: Exam | null;
  lessonCount: number;
};

export type Catalog = {
  generatedAt: string;
  sections: Section[];
  lessons: Lesson[];
  stats: {
    lessonsScanned: number;
    lessonsKept: number;
    filesCopied: number;
    freeLessons: number;
  };
};

export const catalog = catalogData as unknown as Catalog;

export function getLessonBySlug(slug: string): Lesson | undefined {
  return catalog.lessons.find((l) => l.slug === slug);
}

export const SUBJECT_LABEL: Record<Subject, string> = {
  algebra: "алгебра",
  geometry: "геометрия",
  informatics: "информатика",
  math: "математика",
  other: "прочее",
};

export const EXAM_LABEL: Record<Exam, string> = {
  ege: "ЕГЭ",
  oge: "ОГЭ",
  demo: "демо",
};

export function lessonChips(l: Lesson): string[] {
  const out: string[] = [];
  if (l.grade) out.push(`${l.grade} класс`);
  if (l.exam) out.push(EXAM_LABEL[l.exam]);
  out.push(SUBJECT_LABEL[l.subject]);
  return out;
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Префиксует абсолютный путь basePath для PDF/PNG из public/.
 *  Next/Link сам префиксит маршруты, но <a href> и <img src> к статике — нет. */
export function asset(p: string | null | undefined): string | null {
  if (!p) return null;
  if (!BASE_PATH) return p;
  if (p.startsWith("http") || p.startsWith(BASE_PATH)) return p;
  return `${BASE_PATH}${p}`;
}

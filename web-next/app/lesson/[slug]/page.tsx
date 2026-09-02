import Link from "next/link";
import { notFound } from "next/navigation";
import { asset, catalog, getLessonBySlug, lessonChips } from "@/lib/catalog";
import { LessonCard } from "@/components/lesson-card";
import { ShareGate } from "@/components/share-gate";
import { FavoriteButton } from "@/components/favorite-button";
import {
  MaterialsCarousel,
  type MaterialItem,
} from "@/components/materials-carousel";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) return { title: "Урок не найден — Неумошка" };

  const ogImage = lesson.files.preview ? asset(lesson.files.preview) : undefined;
  const cleanedDescription = cleanDescription(lesson.description);
  const available = [
    lesson.files.presentation && "презентация",
    lesson.files.worksheet && "рабочий лист",
    lesson.files.answers && "ответы",
  ].filter(Boolean);
  const description =
    cleanedDescription?.slice(0, 160) ||
    `${lesson.sectionTitle}. Готовые материалы: ${available.join(", ")}.`;

  return {
    title: `${lesson.title} — Неумошка`,
    description,
    alternates: { canonical: `/lesson/${lesson.slug}` },
    openGraph: {
      title: lesson.title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: lesson.title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const chips = lessonChips(lesson);
  const related = catalog.lessons
    .filter((item) => item.section === lesson.section && item.slug !== lesson.slug)
    .slice(0, 3);
  const fileItems: { key: string; label: string; available: boolean }[] = [
    {
      key: "presentation",
      label: "Презентация",
      available: Boolean(lesson.files.presentation),
    },
    {
      key: "worksheet",
      label: "Рабочий лист",
      available: Boolean(lesson.files.worksheet),
    },
    {
      key: "answers",
      label: "Ответы",
      available: Boolean(lesson.files.answers),
    },
  ];
  const description = cleanDescription(lesson.description);
  const previewUrl = asset(lesson.files.preview);
  const carouselItems: MaterialItem[] = fileItems
    .filter((file) => file.available)
    .map((file) => ({
      key: file.key as MaterialItem["key"],
      label: file.label,
      href: `/api/file/${lesson.slug}/${file.key}`,
    }));

  return (
    <>
      <div className="breadcrumbs-bar">
        <nav className="wrap mono muted breadcrumbs" aria-label="Хлебные крошки">
          <Link href="/catalog">каталог</Link>
          <span aria-hidden> / </span>
          <Link href={`/catalog?s=${lesson.section}`}>{lesson.sectionTitle}</Link>
          <span aria-hidden> / </span>
          <span aria-current="page">{lesson.title}</span>
        </nav>
      </div>

      <section className="lesson-section">
        <div className="wrap">
          <div className="lesson-detail-grid">
            <div className="lesson-detail-meta col">
              <div className="chip-row">
                {chips.map((chip) => (
                  <span key={chip} className="chip">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="lesson-heading-row">
                <h1 className="serif lesson-title">{lesson.title}</h1>
                <FavoriteButton
                  slug={lesson.slug}
                  title={lesson.title}
                  className="lesson-favorite"
                />
              </div>

              <ShareGate
                slug={lesson.slug}
                title={lesson.title}
                free={lesson.free}
                files={{
                  presentation: lesson.files.presentation
                    ? `/api/file/${lesson.slug}/presentation`
                    : null,
                  worksheet: lesson.files.worksheet
                    ? `/api/file/${lesson.slug}/worksheet`
                    : null,
                  answers: lesson.files.answers
                    ? `/api/file/${lesson.slug}/answers`
                    : null,
                }}
              />

              <div className="card card-tight lesson-contents">
                <div className="eyebrow">что внутри</div>
                <ul>
                  {fileItems.map((file) => (
                    <li
                      key={file.key}
                      className="row"
                      data-available={file.available}
                    >
                      <span className="mono file-status" aria-hidden>
                        {file.available ? "✓" : "·"}
                      </span>
                      <span>{file.label}</span>
                      {!file.available && (
                        <span className="faded missing-file">нет в этом уроке</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="eyebrow">раздел</div>
                <p className="muted lesson-section-link">
                  <Link href={`/catalog?s=${lesson.section}`}>
                    {lesson.sectionTitle}
                  </Link>
                </p>
              </div>
            </div>

            <div className="lesson-detail-preview">
              <MaterialsCarousel
                items={carouselItems}
                lessonTitle={lesson.title}
                previewUrl={previewUrl}
              />

              {description && (
                <div className="lesson-description">
                  <span className="eyebrow">описание</span>
                  <p>{description}</p>
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <div className="related-lessons">
              <span className="eyebrow">похожие уроки</span>
              <h2>Из той же темы.</h2>
              <div className="lesson-grid">
                {related.map((item) => (
                  <LessonCard key={item.slug} lesson={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function cleanDescription(value: string | null): string | null {
  if (!value) return null;
  const lines = value.replaceAll("**", "").split(/\r?\n/);
  const cutoff = lines.findIndex((line) =>
    ["В открытом доступе", "👑", "👇"].some((marker) =>
      line.trim().startsWith(marker)
    )
  );
  const useful = (cutoff >= 0 ? lines.slice(0, cutoff) : lines)
    .filter((line) => !line.includes("[Ссылка_на_Donut]"))
    .filter((line) => !line.trim().startsWith("#"))
    .join("\n")
    .trim();
  return useful || null;
}

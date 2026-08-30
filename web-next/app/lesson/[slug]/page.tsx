import Link from "next/link";
import { notFound } from "next/navigation";
import { catalog, getLessonBySlug, lessonChips, asset } from "@/lib/catalog";
import { LessonCard } from "@/components/lesson-card";
import { ShareGate } from "@/components/share-gate";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) return { title: "Урок не найден — Неумошка" };
  const ogImage = lesson.files.preview ? asset(lesson.files.preview) : undefined;
  return {
    title: `${lesson.title} — ${lesson.sectionTitle} — Неумошка`,
    description:
      lesson.description?.slice(0, 160) ||
      `Готовый урок «${lesson.title}» от Павла Неумоина.`,
    openGraph: {
      title: lesson.title,
      description: `${lesson.sectionTitle}. Презентация и рабочий лист от Павла Неумоина.`,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const chips = lessonChips(lesson);
  const related = catalog.lessons
    .filter((l) => l.section === lesson.section && l.slug !== lesson.slug)
    .slice(0, 3);

  // Все ссылки на файлы идут через middleware-rewrite на /api/file/[slug]/[type].
  // ShareGate сам подменит их если у пользователя нет unlock.
  const fileItems: { key: string; label: string; available: boolean }[] = [
    { key: "presentation", label: "Презентация", available: !!lesson.files.presentation },
    { key: "worksheet", label: "Рабочий лист", available: !!lesson.files.worksheet },
    { key: "answers", label: "Ответы", available: !!lesson.files.answers },
  ];

  const previewUrl = asset(lesson.files.preview);

  return (
    <>
      {/* Breadcrumbs */}
      <div style={{ padding: "18px 0", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap mono muted" style={{ fontSize: 13 }}>
          <Link href="/catalog">каталог</Link>
          {" / "}
          <Link href={`/catalog?s=${lesson.section}`}>{lesson.sectionTitle}</Link>
          {" / "}
          <span style={{ color: "var(--ink)" }}>{lesson.title}</span>
        </div>
      </div>

      <section style={{ padding: "40px 0 96px" }}>
        <div className="wrap">
          <div
            className="lesson-detail-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr",
              gap: 56,
              alignItems: "start",
            }}
          >
            {/* Preview */}
            <div>
              <div
                className="slide-preview"
                style={{ aspectRatio: "4 / 3" }}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt={lesson.title} />
                ) : (
                  <div className="sp-inner" style={{ padding: "32px 40px" }}>
                    <div>
                      <div
                        className="sp-eyebrow mono muted"
                        style={{ fontSize: 11 }}
                      >
                        {chips.slice(0, 2).join(" · ")}
                      </div>
                      <div
                        className="sp-title"
                        style={{ fontSize: 32, marginTop: 8 }}
                      >
                        {lesson.title}
                      </div>
                    </div>
                    <div className="sp-bullets">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="sp-meta" style={{ fontSize: 11 }}>
                      <span>неумошка</span>
                      <span>после репоста</span>
                    </div>
                  </div>
                )}
              </div>

              {lesson.description && (
                <div style={{ marginTop: 40 }}>
                  <span className="eyebrow">описание</span>
                  <p
                    style={{
                      marginTop: 12,
                      fontSize: 16,
                      lineHeight: 1.65,
                      whiteSpace: "pre-wrap",
                      color: "var(--ink-2)",
                    }}
                  >
                    {lesson.description}
                  </p>
                </div>
              )}
            </div>

            {/* Meta sticky */}
            <div
              className="col"
              style={{ gap: 24, position: "sticky", top: 96 }}
            >
              <div className="chip-row">
                {chips.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
              <h1 className="serif" style={{ fontSize: 44 }}>
                {lesson.title}
              </h1>

              <ShareGate
                key={lesson.slug}
                slug={lesson.slug}
                title={lesson.title}
                isFree={lesson.free}
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

              <div
                className="card card-tight"
                style={{ background: "var(--bg-soft)", border: "none" }}
              >
                <div className="eyebrow" style={{ marginBottom: 12 }}>
                  что внутри
                </div>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    fontSize: 15,
                  }}
                >
                  {fileItems.map((f) => (
                    <li
                      key={f.key}
                      className="row"
                      style={{
                        gap: 10,
                        color: f.available ? "var(--ink)" : "var(--ink-3)",
                      }}
                    >
                      <span
                        className="mono"
                        style={{
                          color: f.available ? "var(--accent)" : "var(--ink-3)",
                          width: 12,
                        }}
                      >
                        {f.available ? "✓" : "·"}
                      </span>
                      <span>{f.label}</span>
                      {!f.available && (
                        <span className="faded" style={{ fontSize: 12 }}>
                          (нет в этом уроке)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>
                  раздел
                </div>
                <p style={{ fontSize: 14 }} className="muted">
                  <Link href={`/catalog?s=${lesson.section}`}>
                    {lesson.sectionTitle}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div
              style={{
                marginTop: 96,
                paddingTop: 56,
                borderTop: "1px solid var(--line)",
              }}
            >
              <span className="eyebrow">похожие уроки</span>
              <h2 style={{ marginTop: 12, marginBottom: 32 }}>
                Из той же темы.
              </h2>
              <div className="lesson-grid">
                {related.map((l) => (
                  <LessonCard key={l.slug} lesson={l} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import type { Lesson } from "@/lib/catalog";
import { lessonChips, asset } from "@/lib/catalog";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const chips = lessonChips(lesson);
  const previewUrl = asset(lesson.files.preview);
  return (
    <Link href={`/lesson/${lesson.slug}`} className="lesson-card">
      <div className="slide-preview">
        {previewUrl ? (
          <img src={previewUrl} alt={lesson.title} />
        ) : (
          <div className="sp-inner">
            <div>
              <div className="sp-eyebrow mono muted">
                {chips.slice(0, 2).join(" · ")}
              </div>
              <div className="sp-title" style={{ marginTop: 6 }}>
                {lesson.title}
              </div>
            </div>
            <div className="sp-bullets">
              <div />
              <div />
              <div />
            </div>
            <div className="sp-meta">
              <span>неумошка</span>
              <span>{lesson.free ? "бесплатно" : "по подписке"}</span>
            </div>
          </div>
        )}
      </div>
      <div className="title">{lesson.title}</div>
      <div className="meta">
        {chips.map((c) => (
          <span key={c} className="chip">
            {c}
          </span>
        ))}
        {lesson.free && <span className="chip accent">бесплатно</span>}
      </div>
    </Link>
  );
}

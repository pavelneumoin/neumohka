import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { asset, lessonChips, type Lesson } from "@/lib/catalog";

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const chips = lessonChips(lesson);
  const previewUrl = asset(lesson.files.preview);

  return (
    <article className="lesson-card" data-lesson-slug={lesson.slug}>
      <Link href={`/lesson/${lesson.slug}`} className="lesson-card-link">
        <div className="slide-preview">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt=""
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 980px) 50vw, 33vw"
            />
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
                <span>в библиотеке</span>
              </div>
            </div>
          )}
        </div>
        <div className="title">{lesson.title}</div>
        <div className="meta">
          {chips.map((chip) => (
            <span key={chip} className="chip">
              {chip}
            </span>
          ))}
          <span className="chip accent">открыто</span>
        </div>
      </Link>
      <FavoriteButton
        slug={lesson.slug}
        title={lesson.title}
        className="lesson-card-favorite"
      />
    </article>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Lesson, Section } from "@/lib/catalog";
import { LessonCard } from "@/components/lesson-card";
import { CatalogFilters } from "@/components/catalog-filters";

export function CatalogList({
  lessons,
  sections,
}: {
  lessons: Lesson[];
  sections: Section[];
}) {
  const searchParams = useSearchParams();
  const activeSections = new Set(searchParams.getAll("s"));
  const onlyFree = searchParams.get("free") === "1";

  const filtered = useMemo(() => {
    let out = lessons;
    if (activeSections.size > 0)
      out = out.filter((l) => activeSections.has(l.section));
    if (onlyFree) out = out.filter((l) => l.free);
    return out;
  }, [lessons, activeSections, onlyFree]);

  return (
    <div className="catalog-layout">
      <CatalogFilters sections={sections} totalCount={filtered.length} />
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 60 }}>
          <h3>Ничего не нашлось</h3>
          <p className="muted" style={{ marginTop: 8, fontSize: 15 }}>
            Попробуйте снять фильтры или выбрать другой раздел.
          </p>
        </div>
      ) : (
        <div className="lesson-grid">
          {filtered.map((l) => (
            <LessonCard key={l.slug} lesson={l} />
          ))}
        </div>
      )}
    </div>
  );
}

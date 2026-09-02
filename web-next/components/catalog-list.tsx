"use client";

import { useSearchParams } from "next/navigation";
import type { Lesson, Section } from "@/lib/catalog";
import { LessonCard } from "@/components/lesson-card";
import { CatalogFilters } from "@/components/catalog-filters";
import { CatalogSearch } from "@/components/catalog-search";
import { rankLessons } from "@/lib/search";

export function CatalogList({
  lessons,
  sections,
}: {
  lessons: Lesson[];
  sections: Section[];
}) {
  const searchParams = useSearchParams();
  const activeSections = new Set(searchParams.getAll("s"));
  const query = searchParams.get("q") ?? "";

  let filtered = lessons;
  if (activeSections.size > 0)
    filtered = filtered.filter((lesson) => activeSections.has(lesson.section));
  filtered = rankLessons(filtered, query);

  return (
    <div>
      <CatalogSearch
        totalCount={filtered.length}
        initialQuery={query}
      />
      <div className="catalog-layout">
        <CatalogFilters sections={sections} />
        <div id="catalog-results" data-search-results>
          {filtered.length === 0 ? (
            <div className="card catalog-empty">
              <h3>
                {query ? `По запросу «${query}» ничего не нашлось` : "Ничего не нашлось"}
              </h3>
              <p className="muted">
                Попробуйте другое слово, уберите номер задания или снимите
                фильтры разделов.
              </p>
            </div>
          ) : (
            <div className="lesson-grid">
              {filtered.map((lesson) => (
                <LessonCard key={lesson.slug} lesson={lesson} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

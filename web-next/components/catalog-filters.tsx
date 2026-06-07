"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Section } from "@/lib/catalog";

type Props = {
  sections: Section[];
  totalCount: number;
};

export function CatalogFilters({ sections, totalCount }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSections = new Set(searchParams.getAll("s"));
  const onlyFree = searchParams.get("free") === "1";

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams]
  );

  const toggleSection = (slug: string) => {
    update((p) => {
      const cur = p.getAll("s");
      p.delete("s");
      const next = cur.includes(slug)
        ? cur.filter((x) => x !== slug)
        : [...cur, slug];
      next.forEach((s) => p.append("s", s));
    });
  };

  const toggleFree = () => {
    update((p) => {
      if (onlyFree) p.delete("free");
      else p.set("free", "1");
    });
  };

  const reset = () => router.push(pathname);

  const hasFilters = activeSections.size > 0 || onlyFree;

  return (
    <aside>
      <div className="filter-group">
        <h4>Раздел</h4>
        <div className="filter-list">
          {sections.map((s) => (
            <label key={s.slug} className="checkbox">
              <input
                type="checkbox"
                checked={activeSections.has(s.slug)}
                onChange={() => toggleSection(s.slug)}
              />
              <span>
                {s.title}{" "}
                <span className="faded mono" style={{ fontSize: 11 }}>
                  {s.lessonCount}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="filter-group">
        <h4>Доступ</h4>
        <div className="filter-list">
          <label className="checkbox">
            <input type="checkbox" checked={onlyFree} onChange={toggleFree} />
            <span>Только бесплатные</span>
          </label>
        </div>
      </div>
      <div className="filter-group">
        <div
          className="row-between"
          style={{ fontSize: 13 }}
        >
          <span className="muted">
            показано: {totalCount}
          </span>
          {hasFilters && (
            <button
              className="btn ghost sm"
              onClick={reset}
              type="button"
            >
              Сбросить
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

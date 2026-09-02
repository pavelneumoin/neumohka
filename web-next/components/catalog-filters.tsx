"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Section } from "@/lib/catalog";

type Props = {
  sections: Section[];
};

export function CatalogFilters({ sections }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeSections = new Set(searchParams.getAll("s"));

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
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

  const reset = () => {
    update((params) => params.delete("s"));
  };

  const hasFilters = activeSections.size > 0;

  return (
    <aside aria-label="Фильтры каталога">
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
        {hasFilters && (
          <button className="btn ghost sm block" onClick={reset} type="button">
            Сбросить разделы
          </button>
        )}
      </div>
    </aside>
  );
}

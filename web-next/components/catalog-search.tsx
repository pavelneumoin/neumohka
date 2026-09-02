"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

export function CatalogSearch({
  totalCount,
  initialQuery,
}: {
  totalCount: number;
  initialQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const routeQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateQuery = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    const suffix = params.toString();
    router.replace(suffix ? `${pathname}?${suffix}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (query === routeQuery) return;
    const timeout = window.setTimeout(() => updateQuery(query), 180);
    return () => window.clearTimeout(timeout);
  }, [query, routeQuery, updateQuery]);

  useEffect(() => {
    const syncHistoryQuery = () => {
      setQuery(new URL(window.location.href).searchParams.get("q") ?? "");
    };
    window.addEventListener("popstate", syncHistoryQuery);
    return () => window.removeEventListener("popstate", syncHistoryQuery);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const editing = target?.matches("input, textarea, select, [contenteditable=true]");
      if (event.key === "/" && !editing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateQuery(query);
    inputRef.current?.blur();
  };

  return (
    <div className="catalog-search-panel">
      <form role="search" className="catalog-search" onSubmit={submit}>
        <label htmlFor="catalog-search">Умный поиск по урокам</label>
        <div className="catalog-search-control">
          <span className="catalog-search-icon" aria-hidden>
            ⌕
          </span>
          <input
            ref={inputRef}
            id="catalog-search"
            name="q"
            type="search"
            autoComplete="off"
            placeholder="Например: задание 15, тригонометрия или nhbujyjvtnhbz"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                setQuery("");
              }
            }}
            aria-controls="catalog-results"
          />
          {query && (
            <button
              type="button"
              className="catalog-search-clear"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Очистить поиск"
            >
              ×
            </button>
          )}
        </div>
        <p className="catalog-search-hint">
          Понимает опечатки, сокращения, латиницу и неверную раскладку.
          <span id="catalog-result-count" aria-live="polite">
            Найдено: {totalCount}
          </span>
        </p>
      </form>
    </div>
  );
}

"use client";

import Image from "next/image";
import { KeyboardEvent, useState, useSyncExternalStore } from "react";

export type MaterialItem = {
  key: "presentation" | "worksheet" | "answers";
  label: string;
  href: string;
};

export function MaterialsCarousel({
  items,
  lessonTitle,
  previewUrl,
}: {
  items: MaterialItem[];
  lessonTitle: string;
  previewUrl?: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeIndex = Math.min(activeIndex, Math.max(0, items.length - 1));
  const active = items[safeIndex];
  const canEmbedPdf = useSyncExternalStore(
    subscribeToDesktopViewport,
    getDesktopViewport,
    getServerDesktopViewport
  );

  if (!active) {
    return (
      <div className="materials-empty card">
        <p className="muted">Файлы этого урока ещё готовятся.</p>
      </div>
    );
  }

  const move = (direction: -1 | 1) => {
    setActiveIndex((index) => (index + direction + items.length) % items.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  };

  const inlineUrl = `${active.href}?inline=1#toolbar=1&navpanes=0&view=FitH`;

  return (
    <div
      className="materials-carousel"
      role="region"
      aria-roledescription="карусель"
      aria-label={`Материалы урока «${lessonTitle}»`}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="materials-carousel-head">
        <div>
          <span className="eyebrow">смотреть материал</span>
          <h2>{active.label}</h2>
        </div>
        <span className="mono muted materials-count" aria-live="polite">
          {safeIndex + 1} / {items.length}
        </span>
      </div>

      <div className="materials-tabs" role="group" aria-label="Тип материала">
        {items.map((item, index) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={index === safeIndex}
            className={index === safeIndex ? "active" : undefined}
            onClick={() => setActiveIndex(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {canEmbedPdf ? (
        <div className="materials-frame">
          <iframe
            key={active.key}
            src={inlineUrl}
            title={`${active.label}: ${lessonTitle}`}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="materials-frame materials-mobile-preview">
          {previewUrl && (
            <Image src={previewUrl} alt="" fill sizes="100vw" />
          )}
          <div className="materials-mobile-message">
            <span className="materials-mobile-icon" aria-hidden>
              PDF
            </span>
            <strong>{active.label}</strong>
            <p>На телефоне материал откроется на весь экран.</p>
            <a href={inlineUrl} target="_blank" rel="noreferrer" className="btn primary">
              Открыть для просмотра ↗
            </a>
          </div>
        </div>
      )}

      <div className="materials-carousel-controls">
        <button
          type="button"
          className="btn"
          onClick={() => move(-1)}
          disabled={items.length < 2}
          aria-label="Предыдущий материал"
        >
          ← Назад
        </button>
        <div className="materials-open-actions">
          {canEmbedPdf && (
            <a href={inlineUrl} target="_blank" rel="noreferrer" className="btn ghost">
              На весь экран ↗
            </a>
          )}
          <a href={active.href} className="btn primary">
            Скачать PDF
          </a>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => move(1)}
          disabled={items.length < 2}
          aria-label="Следующий материал"
        >
          Вперёд →
        </button>
      </div>
      <p className="materials-keyboard-hint mono muted">
        переключайте материалы клавишами ← и →
      </p>
    </div>
  );
}

const DESKTOP_VIEWPORT = "(min-width: 981px) and (hover: hover) and (pointer: fine)";

function subscribeToDesktopViewport(callback: () => void) {
  const media = window.matchMedia(DESKTOP_VIEWPORT);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getDesktopViewport() {
  return window.matchMedia(DESKTOP_VIEWPORT).matches;
}

function getServerDesktopViewport() {
  return false;
}

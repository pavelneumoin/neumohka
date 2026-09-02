"use client";

import Link from "next/link";
import { LessonCard } from "@/components/lesson-card";
import { useSession } from "@/components/session-provider";
import type { Lesson } from "@/lib/catalog";
import type { PublicUser } from "@/lib/store";

export function AccountDashboard({
  user,
  favoriteLessons,
  totalLessons,
}: {
  user: PublicUser;
  favoriteLessons: Lesson[];
  totalLessons: number;
}) {
  const { favorites, status } = useSession();
  const visibleFavorites =
    status === "authenticated"
      ? favoriteLessons.filter((lesson) => favorites.has(lesson.slug))
      : status === "anonymous"
        ? []
        : favoriteLessons;
  const subjects = new Set(visibleFavorites.map((lesson) => lesson.subject)).size;

  return (
    <section className="account-page section">
      <div className="wrap">
        <div className="account-hero">
          <div className="account-profile">
            <div className="account-avatar" aria-hidden>
              {user.name.slice(0, 1).toLocaleUpperCase("ru-RU")}
            </div>
            <div>
              <span className="eyebrow">личный кабинет</span>
              <h1>Здравствуйте, {firstName(user.name)}.</h1>
              <p className="muted">
                @{user.username ?? "пользователь"} · ваша личная библиотека
              </p>
            </div>
          </div>
          <Link href="/catalog" className="btn primary lg">
            Найти новый урок →
          </Link>
        </div>

        <div className="account-stats" aria-label="Статистика кабинета">
          <Stat value={String(visibleFavorites.length)} label="в избранном" />
          <Stat value={String(subjects)} label="направления" />
          <Stat value={String(totalLessons)} label="уроков в каталоге" />
        </div>

        <div className="account-content" data-account-favorites>
          <div className="account-section-head">
            <div>
              <span className="eyebrow">★ сохранённое</span>
              <h2>Избранные материалы.</h2>
            </div>
            {visibleFavorites.length > 0 && (
              <Link href="/catalog" className="btn">
                Открыть каталог
              </Link>
            )}
          </div>

          {visibleFavorites.length > 0 ? (
            <div className="lesson-grid">
              {visibleFavorites.map((lesson) => (
                <LessonCard key={lesson.slug} lesson={lesson} />
              ))}
            </div>
          ) : (
            <div className="account-empty card">
              <div className="account-empty-star" aria-hidden>
                ☆
              </div>
              <h3>Здесь появятся ваши уроки</h3>
              <p className="muted">
                Нажмите на звезду в каталоге или на странице урока — материал
                сохранится в личном кабинете.
              </p>
              <Link href="/catalog" className="btn primary lg">
                Перейти к умному поиску →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="account-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function firstName(name: string) {
  return name.trim().split(/\s+/, 1)[0] || "коллега";
}

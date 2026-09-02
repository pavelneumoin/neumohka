"use client";

import { useSession } from "@/components/session-provider";

export function FavoriteButton({
  slug,
  title,
  className = "",
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const { favorites, pendingFavorites, status, toggleFavorite } = useSession();
  const active = favorites.has(slug);
  const pending = pendingFavorites.has(slug);
  const action = active ? "Удалить из избранного" : "Добавить в избранное";

  return (
    <button
      type="button"
      className={`favorite-button${active ? " active" : ""}${className ? ` ${className}` : ""}`}
      aria-label={`${action}: ${title}`}
      aria-pressed={active}
      disabled={pending || status === "loading"}
      data-favorite-slug={slug}
      onClick={() => void toggleFavorite(slug)}
    >
      <span aria-hidden>{active ? "★" : "☆"}</span>
    </button>
  );
}

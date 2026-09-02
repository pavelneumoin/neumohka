"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PublicUser } from "@/lib/store";

type SessionStatus = "loading" | "authenticated" | "anonymous" | "error";

type SessionValue = {
  status: SessionStatus;
  user: PublicUser | null;
  favorites: ReadonlySet<string>;
  pendingFavorites: ReadonlySet<string>;
  refresh: () => Promise<void>;
  toggleFavorite: (slug: string) => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionValue | null>(null);

type MeResponse = {
  user: PublicUser | null;
  favorites?: string[];
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<SessionStatus>("loading");
  const [user, setUser] = useState<PublicUser | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const [pendingFavorites, setPendingFavorites] = useState<Set<string>>(
    () => new Set()
  );
  const [favoriteError, setFavoriteError] = useState<string | null>(null);
  const favoriteErrorTimer = useRef<number | null>(null);

  const showFavoriteError = useCallback((message: string) => {
    setFavoriteError(message);
    if (favoriteErrorTimer.current) window.clearTimeout(favoriteErrorTimer.current);
    favoriteErrorTimer.current = window.setTimeout(() => {
      setFavoriteError(null);
      favoriteErrorTimer.current = null;
    }, 5_000);
  }, []);

  useEffect(
    () => () => {
      if (favoriteErrorTimer.current) {
        window.clearTimeout(favoriteErrorTimer.current);
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) throw new Error(`status ${response.status}`);
      const data = (await response.json()) as MeResponse;
      setUser(data.user);
      setFavorites(new Set(data.favorites ?? []));
      setStatus(data.user ? "authenticated" : "anonymous");
    } catch (error) {
      console.error("Session request failed:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`status ${response.status}`);
        return (await response.json()) as MeResponse;
      })
      .then((data) => {
        if (cancelled) return;
        setUser(data.user);
        setFavorites(new Set(data.favorites ?? []));
        setStatus(data.user ? "authenticated" : "anonymous");
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("Session request failed:", error);
        setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavorite = useCallback(
    async (slug: string) => {
      if (!user) {
        const current = `${window.location.pathname}${window.location.search}`;
        const next = current.startsWith("/") ? current : "/catalog";
        router.push(`/login?next=${encodeURIComponent(next)}`);
        return;
      }
      if (pendingFavorites.has(slug)) return;

      const nextValue = !favorites.has(slug);
      setFavorites((current) => {
        const next = new Set(current);
        if (nextValue) next.add(slug);
        else next.delete(slug);
        return next;
      });
      setPendingFavorites((current) => new Set(current).add(slug));
      setFavoriteError(null);

      try {
        const response = await fetch(`/api/favorites/${encodeURIComponent(slug)}`, {
          method: nextValue ? "PUT" : "DELETE",
        });
        if (response.status === 401) {
          setUser(null);
          setStatus("anonymous");
          const current = `${window.location.pathname}${window.location.search}`;
          router.push(`/login?next=${encodeURIComponent(current)}`);
          throw new Error("authentication_required");
        }
        if (response.status === 429) throw new Error("rate_limited");
        if (!response.ok) throw new Error(`status ${response.status}`);
      } catch (error) {
        console.error("Favorite update failed:", error);
        showFavoriteError(
          error instanceof Error && error.message === "authentication_required"
            ? "Войдите в аккаунт, чтобы сохранить материал."
            : error instanceof Error && error.message === "rate_limited"
              ? "Слишком много действий подряд. Подождите немного и повторите."
              : "Не удалось обновить избранное. Проверьте соединение и повторите."
        );
        setFavorites((current) => {
          const next = new Set(current);
          if (nextValue) next.delete(slug);
          else next.add(slug);
          return next;
        });
      } finally {
        setPendingFavorites((current) => {
          const next = new Set(current);
          next.delete(slug);
          return next;
        });
      }
    }, [favorites, pendingFavorites, router, showFavoriteError, user]
  );

  const logout = useCallback(async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) throw new Error(`Logout failed: ${response.status}`);
    setUser(null);
    setFavorites(new Set());
    setStatus("anonymous");
    router.replace("/");
    router.refresh();
  }, [router]);

  const value = useMemo<SessionValue>(
    () => ({
      status,
      user,
      favorites,
      pendingFavorites,
      refresh,
      toggleFavorite,
      logout,
    }),
    [favorites, logout, pendingFavorites, refresh, status, toggleFavorite, user]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
      {favoriteError && (
        <div className="favorite-toast" role="alert">
          {favoriteError}
        </div>
      )}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used inside SessionProvider");
  return value;
}

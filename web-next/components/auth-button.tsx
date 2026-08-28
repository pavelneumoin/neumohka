"use client";

import { useEffect, useRef, useState } from "react";

type Me = {
  id: string;
  vk_id: number;
  name: string;
  avatar: string | null;
} | null;

type VkOneTapSubscription = {
  on: (
    event: string,
    handler: (payload: unknown) => void
  ) => VkOneTapSubscription;
};

declare global {
  interface Window {
    VKIDSDK?: {
      Config: { init: (cfg: Record<string, unknown>) => void; ResponseMode: { Callback: string } };
      ConfigResponseMode: { Callback: string };
      ConfigSource: { LOWCODE: string };
      OneTap: new () => {
        render: (cfg: {
          container: HTMLElement;
          showAlternativeLogin?: boolean;
        }) => VkOneTapSubscription;
        close: () => void;
      };
      WidgetEvents: { ERROR: string };
      OneTapInternalEvents: { LOGIN_SUCCESS: string };
      Auth: {
        exchangeCode: (
          code: string,
          deviceId: string
        ) => Promise<{ access_token: string; user_id: number }>;
      };
    };
  }
}

const APP_ID = Number(process.env.NEXT_PUBLIC_VK_APP_ID || 0);
const REDIRECT_URL =
  process.env.NEXT_PUBLIC_VK_REDIRECT_URL ||
  "https://neumoshka.ru/api/auth/vk/callback";

export function AuthButton() {
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);
  const [vkReady, setVkReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Загружаем текущего пользователя
  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setMe(d.user))
      .catch(() => setMe(null))
      .finally(() => setLoading(false));
  }, []);

  // 2. Ждём VK SDK (грузится из layout через next/script)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkSdk = () => {
      if (window.VKIDSDK) {
        setVkReady(true);
        return true;
      }
      return false;
    };
    const firstCheck = window.setTimeout(checkSdk, 0);
    const interval = window.setInterval(() => {
      if (checkSdk()) window.clearInterval(interval);
    }, 200);
    return () => {
      window.clearTimeout(firstCheck);
      window.clearInterval(interval);
    };
  }, []);

  // 3. Когда есть SDK и нет пользователя — рендерим VK OneTap кнопку
  useEffect(() => {
    if (loading || me || !vkReady || !containerRef.current) return;
    if (!APP_ID) {
      console.warn("NEXT_PUBLIC_VK_APP_ID не задан");
      return;
    }
    const VKID = window.VKIDSDK!;
    VKID.Config.init({
      app: APP_ID,
      redirectUrl: REDIRECT_URL,
      responseMode: VKID.ConfigResponseMode.Callback,
      source: VKID.ConfigSource.LOWCODE,
      scope: "",
    });

    const oneTap = new VKID.OneTap();
    containerRef.current.innerHTML = ""; // защита от двойного рендера в strict mode
    oneTap
      .render({
        container: containerRef.current,
        showAlternativeLogin: true,
      })
      .on(VKID.WidgetEvents.ERROR, (err: unknown) => {
        console.warn("VK ID error:", err);
      })
      .on(
        VKID.OneTapInternalEvents.LOGIN_SUCCESS,
        async (raw: unknown) => {
          const payload = raw as { code: string; device_id: string };
          try {
            const tokens = await VKID.Auth.exchangeCode(
              payload.code,
              payload.device_id
            );
            const res = await fetch("/api/auth/vk/exchange", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                access_token: tokens.access_token,
                user_id: tokens.user_id,
              }),
            });
            if (!res.ok) throw new Error(`exchange failed: ${res.status}`);
            window.location.reload();
          } catch (err) {
            console.error("VK exchange failed:", err);
          }
        }
      );

    return () => oneTap.close();
  }, [loading, me, vkReady]);

  if (loading) {
    return <span className="mono muted" style={{ fontSize: 12 }}>…</span>;
  }

  if (me) {
    return <UserMenu user={me} />;
  }

  return (
    <div
      ref={containerRef}
      style={{ minWidth: 140 }}
      aria-label="Войти через VK"
    />
  );
}

function UserMenu({ user }: { user: NonNullable<Me> }) {
  const [open, setOpen] = useState(false);
  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        className="btn ghost sm"
        onClick={() => setOpen((v) => !v)}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        {user.avatar && (
          <img
            src={user.avatar}
            alt=""
            width={24}
            height={24}
            style={{ borderRadius: 999 }}
          />
        )}
        <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.name}
        </span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            boxShadow: "var(--shadow-md)",
            padding: 8,
            minWidth: 180,
            zIndex: 100,
          }}
        >
          <button
            type="button"
            onClick={onLogout}
            className="btn ghost sm block"
            style={{ width: "100%", justifyContent: "flex-start" }}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useSession } from "@/components/session-provider";

export function AuthButton() {
  const { status, user } = useSession();

  if (status === "loading") {
    return (
      <span className="mono muted auth-loading" role="status">
        вход…
      </span>
    );
  }
  if (user) return <UserMenu name={user.name} />;
  return (
    <Link href="/login" className="btn ghost sm">
      Войти
    </Link>
  );
}
function UserMenu({ name }: { name: string }) {
  const { logout } = useSession();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const onLogout = async () => {
    setError(false);
    try {
      await logout();
    } catch {
      setError(true);
    }
  };

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="btn ghost sm user-menu-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <span className="user-avatar-fallback" aria-hidden>
          {name.slice(0, 1).toLocaleUpperCase("ru-RU")}
        </span>
        <span className="user-name">{name}</span>
      </button>
      {open && (
        <div id={menuId} className="user-menu-popup" role="menu">
          <Link href="/account" className="btn ghost sm block" role="menuitem">
            Личный кабинет
          </Link>
          <button
            type="button"
            onClick={() => void onLogout()}
            className="btn ghost sm block"
            role="menuitem"
          >
            Выйти
          </button>
          {error && <span className="auth-menu-error">Не удалось выйти</span>}
        </div>
      )}
    </div>
  );
}

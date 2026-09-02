"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthButton } from "@/components/auth-button";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/account", label: "Кабинет" },
  { href: "/faq", label: "Вопросы" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mobileViewport, setMobileViewport] = useState<boolean | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 980px)");
    const update = () => setMobileViewport(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="wrap">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="dot" />
          неумошка
        </Link>
        <NavLinks pathname={pathname} className="nav nav-desktop" />
        <div className="nav-cta">
          <div className="header-auth">
            {mobileViewport === false && <AuthButton />}
          </div>
          <button
            ref={toggleRef}
            type="button"
            className="nav-mobile-toggle"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "закрыть" : "меню"}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-navigation">
          <div className="wrap">
            <NavLinks
              pathname={pathname}
              className="mobile-nav"
              onNavigate={() => setOpen(false)}
            />
            <div className="mobile-auth">
              {mobileViewport === true && <AuthButton />}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLinks({
  pathname,
  className,
  onNavigate,
}: {
  pathname: string;
  className: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className={className} aria-label="Основная навигация">
      {NAV.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

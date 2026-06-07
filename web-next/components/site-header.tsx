"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButton } from "@/components/auth-button";

const NAV = [
  { href: "/catalog", label: "Каталог" },
  { href: "/faq", label: "Вопросы" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand">
          <span className="dot" />
          неумошка
        </Link>
        <nav className="nav">
          {NAV.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "active" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="nav-cta">
          <AuthButton />
          <button className="nav-mobile-toggle" aria-label="Меню">
            меню
          </button>
        </div>
      </div>
    </header>
  );
}

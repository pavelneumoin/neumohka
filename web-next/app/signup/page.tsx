import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { safeNextPath } from "@/lib/navigation";

export const metadata = {
  title: "Регистрация — Неумошка",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string | string[] }>;

export default async function SignupPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = safeNextPath(rawNext);
  if (await getCurrentUser()) redirect(nextPath);

  return (
    <section className="auth-page section">
      <div className="auth-shell">
        <div className="auth-copy">
          <span className="eyebrow">новый кабинет</span>
          <h1>Своя полка с готовыми уроками.</h1>
          <p className="lead">
            Создайте кабинет, отмечайте нужные материалы звездой и собирайте
            личную подборку для ближайших занятий.
          </p>
          <p className="auth-copy-note">
            Все материалы каталога по-прежнему можно просматривать без
            регистрации. Кабинет нужен только для персональных функций.
          </p>
        </div>
        <AuthForm mode="register" nextPath={nextPath} />
      </div>
    </section>
  );
}

import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";
import { safeNextPath } from "@/lib/navigation";

export const metadata = {
  title: "Вход — Неумошка",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string | string[] }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = safeNextPath(rawNext);
  if (await getCurrentUser()) redirect(nextPath);

  return (
    <section className="auth-page section">
      <div className="auth-shell">
        <div className="auth-copy">
          <span className="eyebrow">личный кабинет</span>
          <h1>С возвращением.</h1>
          <p className="lead">
            Войдите, чтобы собирать любимые уроки в одной библиотеке и быстро
            возвращаться к материалам.
          </p>
          <div className="auth-benefit-list" aria-label="Возможности кабинета">
            <span>★ избранное сохраняется между устройствами</span>
            <span>⌕ умный поиск по темам и экзаменам</span>
            <span>▤ просмотр PDF прямо на странице урока</span>
          </div>
        </div>
        <div>
          <AuthForm mode="login" nextPath={nextPath} />
          <p className="auth-privacy-note">
            Мы не просим почту. Вход — только по логину и паролю.
          </p>
        </div>
      </div>
    </section>
  );
}

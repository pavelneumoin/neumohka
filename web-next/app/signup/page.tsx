import Link from "next/link";

export const metadata = { title: "Подписка — Неумошка" };

export default function SignupPage() {
  return (
    <section className="section">
      <div className="wrap-narrow" style={{ maxWidth: 480 }}>
        <span className="eyebrow">подписка</span>
        <h1 style={{ marginTop: 12, fontSize: 36 }}>
          Платный доступ скоро откроется
        </h1>
        <p className="muted" style={{ marginTop: 12, fontSize: 17 }}>
          Сейчас идёт интеграция с ЮKassa. До запуска можно бесплатно скачивать
          уроки из открытого раздела.
        </p>
        <div className="col" style={{ marginTop: 32, gap: 12 }}>
          <Link href="/catalog?free=1" className="btn primary lg">
            Открыть бесплатный раздел →
          </Link>
          <Link href="/pricing" className="btn lg">
            Посмотреть тарифы
          </Link>
        </div>
        <p className="mono muted" style={{ marginTop: 32, fontSize: 12 }}>
          оставьте почту: <a href="mailto:hello@neumoshka.ru">hello@neumoshka.ru</a>{" "}
          — пришлю персональное приглашение в день запуска
        </p>
      </div>
    </section>
  );
}

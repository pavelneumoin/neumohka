import Link from "next/link";

export const metadata = { title: "Вход — Неумошка" };

export default function LoginPage() {
  return (
    <section className="section">
      <div className="wrap-narrow" style={{ maxWidth: 440 }}>
        <span className="eyebrow">вход</span>
        <h1 style={{ marginTop: 12, fontSize: 36 }}>С возвращением</h1>
        <p className="muted" style={{ marginTop: 12 }}>
          Авторизация скоро откроется. Сейчас доступен бесплатный раздел без
          логина — он в каталоге.
        </p>
        <div className="col" style={{ marginTop: 32, gap: 12 }}>
          <Link href="/catalog" className="btn primary lg">
            Открыть каталог →
          </Link>
          <Link href="/pricing" className="btn lg">
            Тарифы
          </Link>
        </div>
      </div>
    </section>
  );
}

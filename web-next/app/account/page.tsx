import Link from "next/link";

export const metadata = { title: "Кабинет — Неумошка" };

export default function AccountPage() {
  return (
    <section className="section">
      <div className="wrap-narrow">
        <span className="eyebrow">кабинет</span>
        <h1 style={{ marginTop: 12, fontSize: 36 }}>
          Кабинет скоро откроется
        </h1>
        <p className="muted" style={{ marginTop: 12 }}>
          Здесь будут история скачиваний, статус подписки, чеки и настройки
          watermark. Запуск — после интеграции с ЮKassa.
        </p>
        <Link
          href="/catalog"
          className="btn primary lg"
          style={{ marginTop: 24 }}
        >
          Открыть каталог →
        </Link>
      </div>
    </section>
  );
}

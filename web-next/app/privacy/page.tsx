export const metadata = {
  title: "Политика обработки персональных данных — Неумошка",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="wrap-narrow">
        <span className="eyebrow">документы</span>
        <h1 style={{ marginTop: 12 }}>Политика обработки персональных данных</h1>
        <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
          Действующая редакция от 2026-08-25.
        </p>
        <div
          className="col"
          style={{ marginTop: 40, gap: 16, fontSize: 16, lineHeight: 1.65 }}
        >
          <p>
            <strong>Что сайт обрабатывает сейчас.</strong> При регистрации —
            логин, отображаемое имя и защищённый хеш пароля; для сессии —
            технический cookie. Серверные журналы могут содержать IP и user-agent.
          </p>
          <p>
            <strong>Зачем.</strong> Чтобы поддерживать вход, выдавать доступ к
            личному кабинету, хранить избранные материалы и защищать сайт от
            технических злоупотреблений.
          </p>
          <p>
            <strong>Как храню.</strong> Пароль не хранится в исходном виде.
            Данные аккаунта, сессии и список избранного хранятся на сервере сайта.
          </p>
          <p>
            <strong>Материалы.</strong> Сайт не добавляет в PDF персональные
            метки и не передаёт данные аккаунта в сами файлы.
          </p>
          <p>
            <strong>Удаление.</strong> Напишите на hello@neumoshka.ru — удалю
            аккаунт и все связанные данные в течение 7 дней.
          </p>
        </div>
      </div>
    </section>
  );
}

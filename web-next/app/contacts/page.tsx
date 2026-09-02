export const metadata = {
  title: "Контакты — Неумошка",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <section className="section">
      <div className="wrap-narrow">
        <span className="eyebrow">контакты</span>
        <h1 style={{ marginTop: 12 }}>Связь</h1>
        <div className="col" style={{ marginTop: 32, gap: 28 }}>
          <div>
            <div className="label">Почта</div>
            <p>
              <a href="mailto:hello@neumoshka.ru">hello@neumoshka.ru</a> — общие
              вопросы, сотрудничество, школы и репетиторы.
            </p>
          </div>
          <div>
            <div className="label">Автор</div>
            <p>
              Павел Неумоин — учитель математики и информатики, автор всех
              материалов.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

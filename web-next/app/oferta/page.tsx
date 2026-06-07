export const metadata = { title: "Оферта — Неумошка" };

export default function OfertaPage() {
  return (
    <section className="section">
      <div className="wrap-narrow">
        <span className="eyebrow">документы</span>
        <h1 style={{ marginTop: 12 }}>Публичная оферта</h1>
        <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
          Действующая редакция от 2026-05-10. Текст оферты будет опубликован
          вместе с запуском приёма платежей.
        </p>

        <div className="col" style={{ marginTop: 40, gap: 24 }}>
          <Section
            num="1"
            title="Общие положения"
            text="Настоящая публичная оферта определяет условия предоставления Павлом Неумоиным доступа к материалам сайта neumoshka.ru учителям математики и информатики на условиях платной подписки."
          />
          <Section
            num="2"
            title="Предмет договора"
            text="Доступ к каталогу готовых уроков (презентации, рабочие листы, ответы) на срок выбранного тарифа. Файлы предоставляются в формате PDF + LaTeX-исходник."
          />
          <Section
            num="3"
            title="Стоимость и оплата"
            text="Месяц — 590 ₽, квартал — 1 490 ₽, год — 4 990 ₽. Оплата производится через ЮKassa банковской картой РФ."
          />
          <Section
            num="4"
            title="Возврат"
            text="Возврат полной стоимости подписки возможен в течение 7 дней с момента оплаты при условии, что автор не нарушил обязательства."
          />
          <Section
            num="5"
            title="Использование материалов"
            text="Подписчик вправе использовать материалы для проведения уроков и распечатывать листы для своих учеников. Перепродажа, публичное распространение и передача доступа третьим лицам запрещены."
          />
          <Section
            num="6"
            title="Контакты"
            text="hello@neumoshka.ru — все вопросы по оферте, возвратам и сотрудничеству."
          />
        </div>
      </div>
    </section>
  );
}

function Section({
  num,
  title,
  text,
}: {
  num: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div
        className="mono"
        style={{ color: "var(--accent)", fontSize: 13, marginBottom: 6 }}
      >
        раздел {num}
      </div>
      <h3 style={{ marginBottom: 6 }}>{title}</h3>
      <p className="muted" style={{ fontSize: 15 }}>
        {text}
      </p>
    </div>
  );
}

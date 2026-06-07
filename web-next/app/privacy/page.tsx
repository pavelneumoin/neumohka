export const metadata = { title: "Политика обработки персональных данных — Неумошка" };

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="wrap-narrow">
        <span className="eyebrow">документы</span>
        <h1 style={{ marginTop: 12 }}>Политика обработки персональных данных</h1>
        <p className="muted" style={{ marginTop: 16, fontSize: 14 }}>
          Действующая редакция от 2026-05-10.
        </p>
        <div
          className="col"
          style={{ marginTop: 40, gap: 16, fontSize: 16, lineHeight: 1.65 }}
        >
          <p>
            <strong>Что я собираю.</strong> Email и имя при регистрации; данные
            об оплате (через ЮKassa, без сохранения номеров карт на сайте); IP
            и user-agent в логах для защиты от злоупотреблений.
          </p>
          <p>
            <strong>Зачем.</strong> Чтобы выдавать вам доступ к подписке,
            присылать чеки и уведомления о новых уроках, а также чтобы
            расследовать случаи нарушения оферты.
          </p>
          <p>
            <strong>Как храню.</strong> На серверах в РФ. Не передаю третьим
            лицам, кроме платёжной системы (ЮKassa) и почтового сервиса
            (для отправки писем).
          </p>
          <p>
            <strong>Watermark на PDF.</strong> На рабочих листах и
            презентациях — невидимая метка с вашим email. Это защита от
            перепродажи; на восприятие файла она не влияет.
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

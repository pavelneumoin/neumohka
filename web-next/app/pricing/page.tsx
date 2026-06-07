import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { FaqItem } from "@/components/faq-item";

export const metadata = {
  title: "Тарифы — Неумошка",
  description: "590 ₽/мес за полный доступ ко всем урокам Павла Неумоина.",
};

export default function PricingPage() {
  const total = catalog.lessons.length;
  return (
    <>
      <section style={{ padding: "80px 0 32px", textAlign: "center" }}>
        <div className="wrap-narrow">
          <span className="eyebrow">тарифы</span>
          <h1 style={{ marginTop: 12 }}>Один доступ ко всему каталогу.</h1>
          <p className="lead" style={{ margin: "16px auto 0" }}>
            Чем дольше период — тем дешевле в пересчёте на месяц. Отмена в один
            клик.
          </p>
        </div>
      </section>

      <section style={{ padding: "32px 0 80px" }}>
        <div className="wrap" style={{ maxWidth: 1000 }}>
          <div className="pricing-grid">
            <div className="plan">
              <div className="plan-head">
                <div className="plan-name">Месяц</div>
              </div>
              <div>
                <div className="plan-price">590 ₽</div>
                <div className="plan-unit">в месяц</div>
              </div>
              <ul className="feat">
                <li>Все {total} уроков</li>
                <li>Watermark с email</li>
                <li>Новинки каждую неделю</li>
                <li>Отмена в любой момент</li>
              </ul>
              <Link href="/signup?plan=month" className="btn block">
                Выбрать
              </Link>
            </div>

            <div className="plan featured">
              <div className="plan-head">
                <div className="plan-name">Год</div>
                <span className="chip accent">−30%</span>
              </div>
              <div>
                <div
                  className="plan-price"
                  style={{ color: "var(--accent-ink)" }}
                >
                  4 990 ₽
                </div>
                <div className="plan-unit">≈ 416 ₽ в месяц</div>
              </div>
              <ul className="feat">
                <li>Все {total} уроков + новинки</li>
                <li>Watermark с email</li>
                <li>Доступ навсегда после оплаты года</li>
                <li>Возврат в первые 7 дней</li>
                <li>Прямая почта Павлу</li>
              </ul>
              <Link href="/signup?plan=year" className="btn primary block">
                Выбрать год
              </Link>
            </div>

            <div className="plan">
              <div className="plan-head">
                <div className="plan-name">Квартал</div>
                <span className="chip">−16%</span>
              </div>
              <div>
                <div className="plan-price">1 490 ₽</div>
                <div className="plan-unit">≈ 497 ₽ в месяц</div>
              </div>
              <ul className="feat">
                <li>Все {total} уроков</li>
                <li>Watermark с email</li>
                <li>Новинки каждую неделю</li>
                <li>Отмена в любой момент</li>
              </ul>
              <Link href="/signup?plan=quarter" className="btn block">
                Выбрать
              </Link>
            </div>
          </div>
          <p
            className="mono muted"
            style={{ textAlign: "center", fontSize: 12, marginTop: 32 }}
          >
            один раздел открыт навсегда без подписки · оплата картой РФ · чек на
            email
          </p>
        </div>
      </section>

      <section
        style={{
          padding: "64px 0",
          background: "var(--bg-soft)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="wrap" style={{ maxWidth: 880 }}>
          <h2 style={{ marginBottom: 32 }}>Что входит во все тарифы</h2>
          <div className="grid grid-2" style={{ gap: "14px 32px" }}>
            {[
              `Все ${total} уроков в каталоге`,
              "Новые уроки каждую неделю",
              "Презентация PDF + LaTeX-исходник",
              "Рабочий лист A4 (когда есть)",
              "Ответы для учителя (когда есть)",
              "Невидимый watermark с email",
              "Возврат в первые 7 дней",
              "Отмена в один клик",
            ].map((t) => (
              <div className="row" key={t} style={{ gap: 12 }}>
                <span
                  style={{ color: "var(--accent)", fontWeight: 600 }}
                >
                  ✓
                </span>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap-narrow">
          <h2 style={{ marginBottom: 24 }}>Частые вопросы по оплате</h2>
          <FaqItem question="Какие способы оплаты">
            Картой через ЮKassa. Принимаем Visa, Mastercard, Мир, СБП. Чек
            приходит на email.
          </FaqItem>
          <FaqItem question="Можно ли оформить от школы">
            Да. Напишите на hello@neumoshka.ru — выставлю счёт по реквизитам,
            пришлю договор и закрывающие документы.
          </FaqItem>
          <FaqItem question="Что если не подошло">
            Возврат в течение 7 дней с момента оплаты. Деньги вернутся на ту же
            карту в течение 3–10 рабочих дней.
          </FaqItem>
          <FaqItem question="Можно ли передать подписку коллеге">
            Подписка персональная. На рабочих листах есть невидимый watermark с
            email — это для защиты от перепродажи. Если у вас несколько
            учителей в школе, напишите — обсудим скидку.
          </FaqItem>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { LessonCard } from "@/components/lesson-card";
import { FaqItem } from "@/components/faq-item";

export default function HomePage() {
  const total = catalog.lessons.length;
  const freeCount = catalog.lessons.filter((l) => l.free).length;
  const sectionCount = catalog.sections.length;

  // 4 урока с превью для секции «реальные слайды» — приоритет бесплатным
  const showcase = [
    ...catalog.lessons.filter((l) => l.free && l.files.preview),
    ...catalog.lessons.filter((l) => !l.free && l.files.preview),
  ].slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="section" style={{ paddingTop: 88 }}>
        <div className="wrap">
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.05fr 1fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            <div className="col" style={{ gap: 24 }}>
              <span className="eyebrow">для учителей · 8–11 класс</span>
              <h1>
                Готовые уроки
                <br />
                математики и информатики.
                <br />
                <span
                  className="serif"
                  style={{ color: "var(--accent)", fontStyle: "italic" }}
                >
                  От Павла — учителю.
                </span>
              </h1>
              <p className="lead">
                Презентация и рабочий лист на каждый урок. Личная библиотека
                Павла Неумоина — все материалы, по которым он сам ведёт уроки.
              </p>
              <div className="row" style={{ gap: 12, marginTop: 8 }}>
                <Link href="/catalog" className="btn primary lg">
                  Открыть каталог →
                </Link>
                <Link href="/pricing" className="btn lg">
                  Тарифы
                </Link>
              </div>
              <p
                className="mono muted"
                style={{ fontSize: 12, marginTop: 4 }}
              >
                один раздел открыт бесплатно навсегда · 590 ₽/мес за всё
              </p>
            </div>

            <div className="laptop">
              <div className="screen">
                <div className="top-bar">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="screen-body">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                    }}
                  >
                    <span className="mono muted" style={{ fontSize: 11 }}>
                      10 класс · алгебра
                    </span>
                    <span className="mono faded" style={{ fontSize: 11 }}>
                      слайд 4 из 18
                    </span>
                  </div>
                  <h3
                    className="serif"
                    style={{ fontSize: 28, lineHeight: 1.1, marginTop: 4 }}
                  >
                    Тригонометрическая окружность
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                      marginTop: 6,
                    }}
                  >
                    <p style={{ fontSize: 14, margin: 0 }}>
                      Точка на единичной окружности задаётся углом{" "}
                      <span className="mono">α</span>:
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 14,
                        padding: "12px 16px",
                        background: "var(--bg-soft)",
                        borderRadius: 8,
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                      }}
                    >
                      <span>x = cos α</span>
                      <span className="faded">·</span>
                      <span>y = sin α</span>
                    </div>
                    <p
                      className="muted"
                      style={{ fontSize: 13, margin: 0 }}
                    >
                      Покажем, что длина дуги равна радианной мере угла.
                    </p>
                  </div>
                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span className="mono faded" style={{ fontSize: 10 }}>
                      neumoshka.ru
                    </span>
                    <span
                      className="chip"
                      style={{ fontSize: 10, padding: "2px 8px" }}
                    >
                      45 мин
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST band */}
      <section
        style={{
          padding: "32px 0",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          background: "var(--bg-soft)",
        }}
      >
        <div
          className="wrap"
          style={{
            display: "flex",
            gap: 48,
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <TrustItem big={String(total)} small="уроков в библиотеке" />
          <TrustItem big={String(sectionCount)} small="разделов: алгебра, инф, ЕГЭ, ОГЭ" />
          <TrustItem big={String(freeCount)} small="уроков открыто бесплатно" />
          <TrustItem big="1" small="автор: Павел Неумоин" />
          <TrustItem big="PDF + LaTeX" small="формат файлов" />
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section">
        <div className="wrap">
          <div style={{ marginBottom: 56, maxWidth: 600 }}>
            <span className="eyebrow">что внутри</span>
            <h2 style={{ marginTop: 12 }}>Три файла на каждый урок.</h2>
          </div>
          <div className="grid grid-3">
            <FeatureCard
              badge="P"
              title="Презентация"
              text="PDF, 16–22 слайда. Структура: разогрев → теория → примеры → задачи на отработку. К ней — LaTeX-исходник, чтобы можно было поправить под свой класс."
            />
            <FeatureCard
              badge="A4"
              title="Рабочий лист"
              text="Готов к печати на класс. С теорией с пропусками, классной и самостоятельной частями. На полях — невидимый watermark с email."
            />
            <FeatureCard
              badge="✓"
              title="Ответы"
              text="Отдельный PDF с решениями для учителя. Где есть код на Python — отдельный .py-файл с разбором."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="section"
        style={{
          background: "var(--bg-soft)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="wrap">
          <div style={{ marginBottom: 56, maxWidth: 600 }}>
            <span className="eyebrow">как работает</span>
            <h2 style={{ marginTop: 12 }}>Три шага. Без воды.</h2>
          </div>
          <div className="grid grid-3" style={{ gap: 32 }}>
            <Step
              n="01"
              title="Зашли"
              text="Один раздел открыт навсегда — без подписки и без логина. Можно просто скачать пару уроков и оценить."
            />
            <Step
              n="02"
              title="Подписались"
              text="590 ₽/мес — открывается весь каталог, что уже есть, и всё, что появится. Отмена в один клик."
            />
            <Step
              n="03"
              title="Провели"
              text="PDF на проектор, рабочий лист на печать. Никаких авторизаций в классе, никаких облаков, ничего лишнего."
            />
          </div>
        </div>
      </section>

      {/* LESSONS PREVIEW (real) */}
      {showcase.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div
              className="row-between"
              style={{ marginBottom: 40, alignItems: "flex-end" }}
            >
              <div style={{ maxWidth: 600 }}>
                <span className="eyebrow">★ скриншоты</span>
                <h2 style={{ marginTop: 12 }}>
                  Реальные слайды из реальных уроков.
                </h2>
                <p className="lead" style={{ marginTop: 16 }}>
                  Не сток-картинки. Это первые страницы PDF, которые вы получите
                  в подписке.
                </p>
              </div>
              <Link href="/catalog" className="btn">
                Весь каталог →
              </Link>
            </div>
            <div className="lesson-grid">
              {showcase.map((l) => (
                <LessonCard key={l.slug} lesson={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRICING TEASER */}
      <section
        className="section"
        style={{
          background: "var(--bg-soft)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="wrap">
          <div style={{ marginBottom: 48, textAlign: "center" }}>
            <span className="eyebrow">тарифы</span>
            <h2 style={{ marginTop: 12 }}>Один доступ ко всему каталогу.</h2>
            <p className="lead" style={{ margin: "16px auto 0" }}>
              Чем дольше период — тем дешевле в пересчёте на месяц.
            </p>
          </div>
          <div
            className="pricing-grid"
            style={{ maxWidth: 960, margin: "0 auto" }}
          >
            <MiniPlan
              name="Месяц"
              price="590 ₽"
              unit="в месяц"
              cta="Выбрать"
              href="/signup?plan=month"
            />
            <MiniPlan
              featured
              name="Год"
              price="4 990 ₽"
              unit="≈ 416 ₽ в месяц"
              chip="−30%"
              cta="Выбрать год"
              href="/signup?plan=year"
            />
            <MiniPlan
              name="Квартал"
              price="1 490 ₽"
              unit="≈ 497 ₽ в месяц"
              chip="−16%"
              cta="Выбрать"
              href="/signup?plan=quarter"
            />
          </div>
          <p
            className="mono muted"
            style={{ textAlign: "center", fontSize: 12, marginTop: 32 }}
          >
            <Link href="/pricing">подробнее о тарифах →</Link>
          </p>
        </div>
      </section>

      {/* MINI FAQ */}
      <section className="section">
        <div className="wrap-narrow">
          <div style={{ marginBottom: 32 }}>
            <span className="eyebrow">вопросы</span>
            <h2 style={{ marginTop: 12 }}>Что обычно спрашивают.</h2>
          </div>
          <FaqItem question="Можно ли распечатывать рабочие листы для всего класса">
            Да. Это обычный PDF на A4. На полях — невидимый watermark с email,
            ученикам он не мешает.
          </FaqItem>
          <FaqItem question="Подходит ли учебникам Мерзляк, Макарычев, Никольский">
            Уроки построены по ФГОС, темы совпадают со всеми основными
            учебниками. В описании урока указано, к каким параграфам подходит.
          </FaqItem>
          <FaqItem question="Что будет с уроками после отмены подписки">
            Скачанные файлы остаются у вас. Доступ к новым закрывается. При
            годовой подписке доступ остаётся навсегда — даже после отмены
            автопродления.
          </FaqItem>
          <FaqItem question="Кто автор">
            Все материалы делает Павел Неумоин — учитель математики и
            информатики. Это его личная библиотека: то же самое, что он
            показывает у себя в классе.
          </FaqItem>
          <p className="mono muted" style={{ marginTop: 24, fontSize: 13 }}>
            <Link href="/faq">все вопросы →</Link>
          </p>
        </div>
      </section>

      {/* CTA bottom */}
      <section
        className="section-tight"
        style={{ background: "var(--accent)", color: "var(--bg)" }}
      >
        <div
          className="wrap"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={{ color: "var(--bg)" }}>
              Один раздел открыт бесплатно навсегда.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                marginTop: 8,
                fontSize: 16,
              }}
            >
              Скачайте уроки без подписки и без логина. Понравится — оформите
              доступ ко всему каталогу.
            </p>
          </div>
          <Link
            href="/catalog?free=1"
            className="btn lg"
            style={{
              background: "var(--bg)",
              color: "var(--accent-ink)",
              borderColor: "var(--bg)",
            }}
          >
            {freeCount} бесплатных уроков →
          </Link>
        </div>
      </section>
    </>
  );
}

function TrustItem({ big, small }: { big: string; small: string }) {
  return (
    <div>
      <div className="serif" style={{ fontSize: 32, lineHeight: 1 }}>
        {big}
      </div>
      <div
        className="mono muted"
        style={{ fontSize: 12, marginTop: 4 }}
      >
        {small}
      </div>
    </div>
  );
}

function FeatureCard({
  badge,
  title,
  text,
}: {
  badge: string;
  title: string;
  text: string;
}) {
  return (
    <div className="card">
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: "var(--accent-soft)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <span
          className="mono"
          style={{
            color: "var(--accent-ink)",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {badge}
        </span>
      </div>
      <h3>{title}</h3>
      <p className="muted" style={{ marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
}

function Step({
  n,
  title,
  text,
}: {
  n: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div
        className="mono"
        style={{
          color: "var(--accent)",
          fontSize: 13,
          marginBottom: 12,
        }}
      >
        шаг {n}
      </div>
      <h3>{title}</h3>
      <p className="muted" style={{ marginTop: 8, fontSize: 15 }}>
        {text}
      </p>
    </div>
  );
}

function MiniPlan({
  name,
  price,
  unit,
  chip,
  cta,
  href,
  featured,
}: {
  name: string;
  price: string;
  unit: string;
  chip?: string;
  cta: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div className={`plan${featured ? " featured" : ""}`}>
      <div className="plan-head">
        <div className="plan-name">{name}</div>
        {chip && (
          <span className={`chip${featured ? " accent" : ""}`}>{chip}</span>
        )}
      </div>
      <div>
        <div
          className="plan-price"
          style={featured ? { color: "var(--accent-ink)" } : undefined}
        >
          {price}
        </div>
        <div className="plan-unit">{unit}</div>
      </div>
      <Link href={href} className={`btn${featured ? " primary" : ""} block`}>
        {cta}
      </Link>
    </div>
  );
}

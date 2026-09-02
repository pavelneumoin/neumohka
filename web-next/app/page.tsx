import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { LessonCard } from "@/components/lesson-card";
import { FaqItem } from "@/components/faq-item";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  const total = catalog.lessons.length;
  const freeCount = catalog.lessons.filter((l) => l.free).length;
  const sectionCount = catalog.sections.length;
  const worksheetCount = catalog.lessons.filter((l) => l.files.worksheet).length;
  const answerCount = catalog.lessons.filter((l) => l.files.answers).length;

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
                Презентация в каждом уроке, рабочие листы — там, где они уже
                готовы. Личная библиотека Павла Неумоина для своих занятий.
              </p>
              <div className="row" style={{ gap: 12, marginTop: 8 }}>
                <Link href="/catalog" className="btn primary lg">
                  Открыть каталог →
                </Link>
                <Link href="/account" className="btn lg">
                  Личный кабинет
                </Link>
              </div>
              <p
                className="mono muted"
                style={{ fontSize: 12, marginTop: 4 }}
              >
                все {total} уроков открыты · кабинет нужен для избранного
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
          <TrustItem big="PDF" small="формат материалов" />
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section">
        <div className="wrap">
          <div style={{ marginBottom: 56, maxWidth: 600 }}>
            <span className="eyebrow">что внутри</span>
            <h2 style={{ marginTop: 12 }}>Материалы для готового урока.</h2>
          </div>
          <div className="grid grid-3">
            <FeatureCard
              badge="P"
              title="Презентация"
              text={`Презентация в PDF есть во всех ${total} уроках. Можно открыть на проекторе или скачать заранее.`}
            />
            <FeatureCard
              badge="A4"
              title="Рабочий лист"
              text={`Рабочие листы сейчас доступны для ${worksheetCount} из ${total} уроков. Наличие всегда честно указано в карточке.`}
            />
            <FeatureCard
              badge="✓"
              title="Ответы"
              text={
                answerCount > 0
                  ? `Отдельные ответы доступны для ${answerCount} уроков.`
                  : "Отдельные файлы с ответами ещё добавляются. Если их нет, карточка урока прямо об этом сообщает."
              }
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
              title="Нашли тему"
              text="Введите тему, класс или номер задания. Поиск понимает опечатки, сокращения и неверную раскладку."
            />
            <Step
              n="02"
              title="Посмотрели материалы"
              text="Переключайтесь между всеми доступными файлами прямо на странице урока."
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
                  Не сток-картинки. Это первые страницы PDF из открытого
                  каталога материалов.
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

      {/* PERSONAL LIBRARY */}
      <section
        className="section"
        style={{
          background: "var(--bg-soft)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="wrap account-promo">
          <div>
            <span className="eyebrow">личная библиотека</span>
            <h2 style={{ marginTop: 12 }}>Нужные уроки всегда под рукой.</h2>
            <p className="lead" style={{ marginTop: 16 }}>
              Отмечайте материалы звездой, собирайте подборку к ближайшим
              занятиям и возвращайтесь к ней из красивого личного кабинета.
            </p>
            <Link href="/signup" className="btn primary lg" style={{ marginTop: 24 }}>
              Создать кабинет →
            </Link>
          </div>
          <div className="account-promo-card card">
            <div className="account-promo-top">
              <span className="account-avatar" aria-hidden>П</span>
              <div>
                <strong>Моя библиотека</strong>
                <p className="mono muted">избранные материалы</p>
              </div>
            </div>
            <div className="account-promo-stats">
              <span><strong>★</strong> сохраняйте уроки</span>
              <span><strong>⌕</strong> находите за секунды</span>
              <span><strong>▤</strong> смотрите PDF онлайн</span>
            </div>
          </div>
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
            Да. Если рабочий лист есть в карточке урока, это обычный PDF на A4,
            который можно распечатать для своего класса.
          </FaqItem>
          <FaqItem question="Подходит ли учебникам Мерзляк, Макарычев, Никольский">
            Темы соответствуют школьной программе, но порядок и формулировки в
            учебниках могут отличаться. Сверьте тему и состав файлов в карточке
            урока перед занятием.
          </FaqItem>
          <FaqItem question="Как сохранить урок на потом">
            Создайте личный кабинет и нажмите на звезду в карточке урока. Он
            сразу появится в вашей персональной библиотеке.
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
              Все {total} уроков уже открыты.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                marginTop: 8,
                fontSize: 16,
              }}
            >
              Ищите тему умным поиском, смотрите материалы онлайн или скачивайте
              PDF для проектора и печати.
            </p>
          </div>
          <Link
            href="/catalog"
            className="btn lg"
            style={{
              background: "var(--bg)",
              color: "var(--accent-ink)",
              borderColor: "var(--bg)",
            }}
          >
            Открыть {freeCount} уроков →
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

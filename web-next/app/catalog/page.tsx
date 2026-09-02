import { Suspense } from "react";
import { catalog } from "@/lib/catalog";
import { CatalogList } from "@/components/catalog-list";

export const metadata = {
  title: "Каталог уроков — Неумошка",
  description:
    "Каталог готовых уроков математики и информатики Павла Неумоина с умным поиском по темам и экзаменам.",
  alternates: { canonical: "/catalog" },
};

export default function CatalogPage() {
  // Описания не нужны поисковому индексу: названия, разделы, классы, экзамены
  // и breadcrumbs дают точный результат без лишнего client payload.
  const catalogLessons = catalog.lessons.map((lesson) => ({
    ...lesson,
    description: null,
  }));

  return (
    <section className="section" style={{ paddingTop: 56 }}>
      <div className="wrap">
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow">каталог</span>
          <h1 style={{ marginTop: 12, fontSize: 44 }}>
            {catalog.lessons.length}{" "}
            <span className="serif" style={{ fontStyle: "italic" }}>
              уроков
            </span>{" "}
            в библиотеке
          </h1>
          <p className="lead" style={{ marginTop: 12 }}>
            Найдите тему даже с опечаткой или неверной раскладкой. Презентации
            и рабочие листы можно открыть прямо на странице урока.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="muted" style={{ padding: 40 }}>
              Загрузка каталога…
            </div>
          }
        >
          <CatalogList
            lessons={catalogLessons}
            sections={catalog.sections}
          />
        </Suspense>
      </div>
    </section>
  );
}

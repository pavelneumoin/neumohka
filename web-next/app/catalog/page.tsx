import { Suspense } from "react";
import { catalog } from "@/lib/catalog";
import { CatalogList } from "@/components/catalog-list";

export const metadata = {
  title: "Каталог уроков — Неумошка",
  description:
    "Каталог готовых уроков математики и информатики Павла Неумоина. Фильтры по разделу и доступу.",
};

export default function CatalogPage() {
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
            Все презентации и рабочие листы, по которым Павел сам проводит
            уроки. Каждый урок — PDF + LaTeX-исходник.
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
            lessons={catalog.lessons}
            sections={catalog.sections}
          />
        </Suspense>
      </div>
    </section>
  );
}

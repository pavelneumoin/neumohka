import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap-narrow not-found">
        <span className="eyebrow">ошибка 404</span>
        <h1 className="serif">Такой страницы нет.</h1>
        <p className="lead">
          Возможно, материал переехал или ссылка устарела. Вернитесь в каталог
          и выберите нужный урок.
        </p>
        <Link href="/catalog" className="btn primary lg">
          Открыть каталог
        </Link>
      </div>
    </section>
  );
}

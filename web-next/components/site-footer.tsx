import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div>
          <Link href="/" className="brand">
            <span className="dot" />
            неумошка
          </Link>
          <p
            className="muted"
            style={{ fontSize: 14, marginTop: 14, maxWidth: 280 }}
          >
            Готовые уроки математики и информатики для 8–11 классов от Павла
            Неумоина. Во время бета-тестирования каталог открыт бесплатно.
          </p>
        </div>
        <div>
          <h4>Сайт</h4>
          <ul>
            <li>
              <Link href="/catalog">Каталог</Link>
            </li>
            <li>
              <Link href="/faq">Вопросы</Link>
            </li>
            <li>
              <Link href="/account">Кабинет</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Помощь</h4>
          <ul>
            <li>
              <Link href="/privacy">Политика</Link>
            </li>
            <li>
              <Link href="/contacts">Контакты</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Связь</h4>
          <ul>
            <li>
              <a href="mailto:hello@neumoshka.ru">hello@neumoshka.ru</a>
            </li>
          </ul>
        </div>
        <div className="legal">
          <span>Павел Неумоин · 2026</span>
          <span>neumoshka.ru</span>
        </div>
      </div>
    </footer>
  );
}

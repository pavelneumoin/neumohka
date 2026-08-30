export function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <details className="faq-item">
      <summary className="faq-q">
        {question}
        <span className="pm" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="faq-a">
        <p>{children}</p>
      </div>
    </details>
  );
}

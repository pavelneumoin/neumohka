"use client";

import { useId, useState } from "react";

export function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const buttonId = useId();
  const answerId = useId();
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button
        className="faq-q"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={answerId}
        id={buttonId}
      >
        {question}
        <span className="pm" aria-hidden>
          +
        </span>
      </button>
      <div
        className="faq-a"
        id={answerId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
      >
        <p>{children}</p>
      </div>
    </div>
  );
}

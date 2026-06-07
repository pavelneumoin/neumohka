"use client";

import { useState } from "react";

export function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button
        className="faq-q"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {question}
        <span className="pm" aria-hidden>
          +
        </span>
      </button>
      <div className="faq-a">
        <p>{children}</p>
      </div>
    </div>
  );
}

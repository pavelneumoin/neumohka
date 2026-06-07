"use client";

import { useEffect, useState, useCallback } from "react";

type Props = {
  slug: string;
  files: {
    presentation: string | null;
    worksheet: string | null;
    answers: string | null;
  };
  title: string;
};

type Me = {
  user: { id: string; name: string; avatar: string | null } | null;
  unlocks: string[];
};

type Stage =
  | "loading"
  | "anonymous"
  | "needs_share"
  | "sharing" // popup открыт, ждём подтверждения
  | "confirming"
  | "unlocked";

export function ShareGate({ slug, files, title }: Props) {
  const [me, setMe] = useState<Me | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Me) => {
        setMe(data);
        if (!data.user) {
          setStage("anonymous");
        } else if (data.unlocks.includes(slug)) {
          setStage("unlocked");
        } else {
          setStage("needs_share");
        }
      })
      .catch(() => {
        setError("Не удалось загрузить статус. Попробуйте обновить страницу.");
      });
  }, [slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onShare = () => {
    setError(null);
    const lessonUrl = window.location.href;
    const shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(lessonUrl)}`;
    window.open(
      shareUrl,
      "vk_share",
      "width=720,height=620,menubar=no,toolbar=no"
    );
    setStage("sharing");
  };

  const onConfirm = async () => {
    setStage("confirming");
    setError(null);
    try {
      const res = await fetch("/api/share/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson_slug: slug }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `share confirm failed: ${res.status}`);
      }
      setStage("unlocked");
      refresh();
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error ? e.message : "Не удалось подтвердить публикацию"
      );
      setStage("needs_share");
    }
  };

  if (stage === "loading") {
    return (
      <div className="muted mono" style={{ fontSize: 12, padding: "8px 0" }}>
        Проверяю статус…
      </div>
    );
  }

  if (stage === "anonymous") {
    return (
      <div className="card card-tight" style={{ background: "var(--bg-soft)", border: "none" }}>
        <p style={{ fontSize: 14, margin: 0 }}>
          Чтобы скачать урок — <strong>войдите через VK</strong> в правом
          верхнем углу. После входа здесь появится кнопка «Поделиться и
          скачать».
        </p>
      </div>
    );
  }

  if (stage === "needs_share" || stage === "sharing" || stage === "confirming") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {stage === "needs_share" && (
          <button
            type="button"
            onClick={onShare}
            className="btn primary lg"
            style={{ justifyContent: "center" }}
          >
            Поделиться в VK и скачать
          </button>
        )}
        {(stage === "sharing" || stage === "confirming") && (
          <>
            <p className="mono muted" style={{ fontSize: 12, margin: 0 }}>
              Завершите репост в открывшемся окне VK, потом нажмите ниже.
            </p>
            <button
              type="button"
              onClick={onConfirm}
              className="btn primary lg"
              disabled={stage === "confirming"}
              style={{ justifyContent: "center" }}
            >
              {stage === "confirming"
                ? "Открываю доступ…"
                : "Я поделился — открыть PDF"}
            </button>
            <button
              type="button"
              onClick={() => setStage("needs_share")}
              className="btn ghost sm"
              style={{ justifyContent: "center" }}
            >
              Вернуться
            </button>
          </>
        )}
        {error && (
          <p
            className="mono"
            style={{ fontSize: 12, color: "#a04545", margin: 0 }}
          >
            {error}
          </p>
        )}
        <p className="mono muted" style={{ fontSize: 11, margin: 0 }}>
          Привет, {me?.user?.name}. После репоста урок откроется и останется
          доступен — можно качать сколько угодно раз.
        </p>
      </div>
    );
  }

  // unlocked
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {files.presentation && (
        <a
          href={files.presentation}
          download
          className="btn primary lg"
          style={{ justifyContent: "center" }}
        >
          Скачать презентацию (PDF)
        </a>
      )}
      {files.worksheet && (
        <a
          href={files.worksheet}
          download
          className="btn lg"
          style={{ justifyContent: "center" }}
        >
          Скачать рабочий лист
        </a>
      )}
      {files.answers && (
        <a
          href={files.answers}
          download
          className="btn lg"
          style={{ justifyContent: "center" }}
        >
          Скачать ответы
        </a>
      )}
      <p className="mono muted" style={{ fontSize: 11, marginTop: -2 }}>
        доступ открыт · {title}
      </p>
    </div>
  );
}

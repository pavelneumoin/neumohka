"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  slug: string;
  free: boolean;
  files: {
    presentation: string | null;
    worksheet: string | null;
    answers: string | null;
  };
  title: string;
};

type Me = {
  user: { id: string; name: string; avatar: string | null } | null;
  unlocks?: string[];
};

type Stage = "loading" | "anonymous" | "locked" | "unlocked" | "error";

export function ShareGate({ slug, free, files, title }: Props) {
  const [stage, setStage] = useState<Stage>(free ? "unlocked" : "loading");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (free) return;
    const controller = new AbortController();
    fetch("/api/auth/me", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`status ${response.status}`);
        return (await response.json()) as Me;
      })
      .then((data) => {
        if (!data.user) setStage("anonymous");
        else if (data.unlocks?.includes(slug)) setStage("unlocked");
        else setStage("locked");
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error("Access status request failed:", error);
        setStage("error");
      });
    return () => controller.abort();
  }, [free, retry, slug]);

  const onRetry = () => {
    setStage("loading");
    setRetry((value) => value + 1);
  };

  if (stage === "loading") {
    return (
      <p className="muted mono" role="status" style={{ fontSize: 12 }}>
        Проверяю доступ…
      </p>
    );
  }

  if (stage === "error") {
    return (
      <div className="card card-tight access-message" role="alert">
        <p>Не удалось проверить доступ. Соединение можно попробовать ещё раз.</p>
        <button type="button" className="btn sm" onClick={onRetry}>
          Повторить
        </button>
      </div>
    );
  }

  if (stage === "anonymous") {
    return (
      <div className="card card-tight access-message">
        <p>Войдите в личный кабинет, чтобы открыть этот материал.</p>
        <Link href={`/login?next=/lesson/${slug}`} className="btn primary">
          Войти
        </Link>
      </div>
    );
  }

  if (stage === "locked") {
    return (
      <div className="card card-tight access-message">
        <p>Этот материал временно недоступен. Выберите другой урок в каталоге.</p>
        <Link href="/catalog" className="btn primary">
          Открыть каталог
        </Link>
      </div>
    );
  }

  return <DownloadLinks files={files} title={title} free={free} />;
}

function DownloadLinks({
  files,
  title,
  free,
}: Pick<Props, "files" | "title" | "free">) {
  return (
    <div className="download-list">
      {files.presentation && (
        <a href={files.presentation} className="btn primary lg">
          Скачать презентацию (PDF)
        </a>
      )}
      {files.worksheet && (
        <a href={files.worksheet} className="btn lg">
          Скачать рабочий лист
        </a>
      )}
      {files.answers && (
        <a href={files.answers} className="btn lg">
          Скачать ответы
        </a>
      )}
      <p className="mono muted" style={{ fontSize: 11 }}>
        {free ? "бесплатный доступ" : "доступ открыт"} · {title}
      </p>
    </div>
  );
}

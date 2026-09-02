"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useSession } from "@/components/session-provider";
import { safeNextPath } from "@/lib/navigation";

type Mode = "login" | "register";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "Неверный логин или пароль.",
  username_taken: "Такой логин уже занят. Попробуйте другой.",
  invalid_fields: "Проверьте заполнение полей.",
  rate_limited: "Слишком много попыток. Подождите минуту.",
};

export function AuthForm({ mode, nextPath }: { mode: Mode; nextPath: string }) {
  const router = useRouter();
  const { refresh } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isRegister = mode === "register";

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    setError(null);
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");
    const passwordRepeat = String(form.get("passwordRepeat") ?? "");
    const name = String(form.get("name") ?? "");

    if (isRegister && password !== passwordRepeat) {
      setError("Пароли не совпадают.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isRegister ? { username, password, name } : { username, password }
          ),
        }
      );
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) throw new Error(data.error || "request_failed");
      await refresh();
      router.replace(safeNextPath(nextPath));
      router.refresh();
    } catch (reason) {
      const code = reason instanceof Error ? reason.message : "request_failed";
      setError(
        ERROR_MESSAGES[code] ||
          "Не удалось выполнить вход. Проверьте соединение и попробуйте ещё раз."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form card" onSubmit={onSubmit}>
      {isRegister && (
        <div>
          <label className="label" htmlFor="name">
            Как к вам обращаться
          </label>
          <input
            className="input"
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={60}
            required
            autoFocus
          />
        </div>
      )}
      <div>
        <label className="label" htmlFor="username">
          Логин
        </label>
        <input
          className="input"
          id="username"
          name="username"
          type="text"
          inputMode="text"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="username"
          pattern="[A-Za-z0-9][A-Za-z0-9._-]{1,30}[A-Za-z0-9]"
          minLength={3}
          maxLength={32}
          required
          autoFocus={!isRegister}
          aria-describedby={isRegister ? "username-hint" : undefined}
        />
        {isRegister && (
          <p id="username-hint" className="field-hint">
            3–32 символа: латинские буквы, цифры, точка, дефис или подчёркивание.
          </p>
        )}
      </div>
      <div>
        <label className="label" htmlFor="password">
          Пароль
        </label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          minLength={8}
          maxLength={128}
          required
          aria-describedby={isRegister ? "password-hint" : undefined}
        />
        {isRegister && (
          <p id="password-hint" className="field-hint">
            Не менее 8 символов. Пароль хранится только в виде защищённого хеша.
          </p>
        )}
      </div>
      {isRegister && (
        <div>
          <label className="label" htmlFor="passwordRepeat">
            Повторите пароль
          </label>
          <input
            className="input"
            id="passwordRepeat"
            name="passwordRepeat"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />
        </div>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="btn primary lg block" type="submit" disabled={submitting}>
        {submitting
          ? "Подождите…"
          : isRegister
            ? "Создать личный кабинет"
            : "Войти"}
      </button>
      <p className="auth-form-switch">
        {isRegister ? "Уже есть кабинет?" : "Ещё нет кабинета?"}{" "}
        <Link
          href={`${isRegister ? "/login" : "/signup"}?next=${encodeURIComponent(nextPath)}`}
        >
          {isRegister ? "Войти" : "Зарегистрироваться"}
        </Link>
      </p>
    </form>
  );
}

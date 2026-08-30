import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getCurrentUser } from "@/lib/auth";
import { hasUnlock } from "@/lib/store";
import { getLessonBySlug } from "@/lib/catalog";
import { resolveMaterialAccess } from "@/lib/material-access";

export const runtime = "nodejs";

const MATERIAL_TYPES = ["presentation", "worksheet", "answers"] as const;
type MaterialType = (typeof MATERIAL_TYPES)[number];
const ALLOWED_TYPES = new Set<MaterialType>(MATERIAL_TYPES);

function isMaterialType(value: string): value is MaterialType {
  return ALLOWED_TYPES.has(value as MaterialType);
}

/**
 * GET /api/file/[slug]/[type]
 * Отдаёт PDF урока с проверкой:
 *   1. бесплатный урок из каталога доступен без сессии;
 *   2. для остальных уроков пользователь должен войти и иметь unlock.
 * Иначе редирект на /lesson/[slug] для входа/share.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string; type: string }> }
) {
  const { slug, type } = await context.params;
  if (!isMaterialType(type)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    return NextResponse.json({ error: "lesson_not_found" }, { status: 404 });
  }
  if (!lesson.files[type]) {
    return NextResponse.json({ error: "file_not_available" }, { status: 404 });
  }

  const user = lesson.free ? null : await getCurrentUser();
  const access = resolveMaterialAccess({
    free: lesson.free,
    authenticated: Boolean(user),
    unlocked: user ? hasUnlock(user.id, slug) : false,
  });

  if (access === "login") {
    return NextResponse.redirect(
      new URL(`/lesson/${slug}?reason=login`, _request.url)
    );
  }

  if (access === "share") {
    return NextResponse.redirect(
      new URL(`/lesson/${slug}?reason=share`, _request.url)
    );
  }

  // путь файла — public/library/{slug}/{type}.pdf
  const filename = `${type}.pdf`;
  const fullPath = path.join(process.cwd(), "public", "library", slug, filename);
  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: "file_missing" }, { status: 404 });
  }

  const buffer = fs.readFileSync(fullPath);
  const downloadName = `${lesson.title} — ${pretty(type)}.pdf`;
  // ArrayBuffer copy — Response не принимает Node Buffer напрямую
  const ab = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
  return new Response(ab, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(buffer.byteLength),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}

function pretty(type: string) {
  if (type === "presentation") return "Презентация";
  if (type === "worksheet") return "Рабочий лист";
  if (type === "answers") return "Ответы";
  return type;
}

import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { getCurrentUser } from "@/lib/auth";
import { hasUnlock } from "@/lib/store";
import { getLessonBySlug } from "@/lib/catalog";
import { PRIVATE_LIBRARY_DIR } from "@/lib/paths";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["presentation", "worksheet", "answers"] as const;
type FileType = (typeof ALLOWED_TYPES)[number];

/**
 * GET /api/file/[slug]/[type]
 * Бесплатные уроки доступны без входа. Для остальных требуется действующий
 * session + серверный unlock. Сами PDF хранятся вне public/.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string; type: string }> }
) {
  const { slug, type } = await context.params;
  if (!ALLOWED_TYPES.includes(type as FileType)) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    return NextResponse.json({ error: "lesson_not_found" }, { status: 404 });
  }

  const fileType = type as FileType;
  if (!lesson.files[fileType]) {
    return NextResponse.json({ error: "file_unavailable" }, { status: 404 });
  }

  if (!lesson.free) {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(
        new URL(`/lesson/${slug}?reason=login`, request.url)
      );
    }

    if (!hasUnlock(user.id, slug)) {
      return NextResponse.redirect(
        new URL(`/lesson/${slug}?reason=access`, request.url)
      );
    }
  }

  const filename = `${fileType}.pdf`;
  const fullPath = path.join(PRIVATE_LIBRARY_DIR, slug, filename);
  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: "file_missing" }, { status: 404 });
  }

  const stat = fs.statSync(fullPath);
  if (!stat.isFile()) {
    return NextResponse.json({ error: "file_missing" }, { status: 404 });
  }

  const downloadName = `${lesson.title} — ${pretty(fileType)}.pdf`;
  const disposition = new URL(request.url).searchParams.get("inline") === "1"
    ? "inline"
    : "attachment";
  const range = parseRange(request.headers.get("range"), stat.size);
  const baseHeaders = {
    "Content-Type": "application/pdf",
    "Content-Disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
    "Cache-Control": "private, max-age=0, must-revalidate",
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
  };
  if (range === "invalid") {
    return new Response(null, {
      status: 416,
      headers: {
        ...baseHeaders,
        "Content-Range": `bytes */${stat.size}`,
      },
    });
  }

  const stream = Readable.toWeb(
    fs.createReadStream(fullPath, range ? { start: range.start, end: range.end } : undefined)
  ) as ReadableStream;
  return new Response(stream, {
    status: range ? 206 : 200,
    headers: {
      ...baseHeaders,
      "Content-Length": String(range ? range.end - range.start + 1 : stat.size),
      ...(range
        ? { "Content-Range": `bytes ${range.start}-${range.end}/${stat.size}` }
        : {}),
    },
  });
}

function parseRange(
  value: string | null,
  size: number
): { start: number; end: number } | "invalid" | null {
  if (!value) return null;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value.trim());
  if (!match || (!match[1] && !match[2]) || size <= 0) return "invalid";

  if (!match[1]) {
    const suffixLength = Number(match[2]);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return "invalid";
    return { start: Math.max(0, size - suffixLength), end: size - 1 };
  }

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : size - 1;
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(requestedEnd) ||
    start < 0 ||
    start >= size ||
    requestedEnd < start
  ) {
    return "invalid";
  }
  return { start, end: Math.min(requestedEnd, size - 1) };
}

function pretty(type: string) {
  if (type === "presentation") return "Презентация";
  if (type === "worksheet") return "Рабочий лист";
  if (type === "answers") return "Ответы";
  return type;
}

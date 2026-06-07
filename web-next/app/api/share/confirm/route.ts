import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { addUnlock } from "@/lib/store";
import { getLessonBySlug } from "@/lib/catalog";

/**
 * POST /api/share/confirm
 * Body: { lesson_slug: string, vk_post_id?: string }
 *
 * Клиент дёргает после успешного открытия VK Share Dialog.
 * Сейчас доверяем клиенту — проверка факта поста через VK API
 * (wall.getById) — TODO в Фазе 1.5, когда сетевая инфра поднимется.
 *
 * Идемпотентен: повторный вызов с тем же slug возвращает ту же unlock.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  let body: { lesson_slug?: string; vk_post_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const lessonSlug = body.lesson_slug;
  if (!lessonSlug) {
    return NextResponse.json(
      { error: "missing_lesson_slug" },
      { status: 400 }
    );
  }

  const lesson = getLessonBySlug(lessonSlug);
  if (!lesson) {
    return NextResponse.json({ error: "lesson_not_found" }, { status: 404 });
  }

  const unlock = addUnlock({
    user_id: user.id,
    lesson_slug: lessonSlug,
    type: "share",
    vk_post_id: body.vk_post_id ?? null,
  });

  return NextResponse.json({
    ok: true,
    unlock: {
      lesson_slug: unlock.lesson_slug,
      type: unlock.type,
      created_at: unlock.created_at,
    },
  });
}

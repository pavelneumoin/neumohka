import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getFavoritesForUser,
  getUnlocksForUser,
  toPublicUser,
} from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return noStoreJson({ user: null, favorites: [], unlocks: [] });
  const unlocks = getUnlocksForUser(user.id).map((u) => u.lesson_slug);
  const favorites = getFavoritesForUser(user.id).map(
    (favorite) => favorite.lesson_slug
  );
  return noStoreJson({
    user: toPublicUser(user),
    favorites,
    unlocks,
  });
}

function noStoreJson(body: unknown) {
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}

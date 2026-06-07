import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUnlocksForUser } from "@/lib/store";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  const unlocks = getUnlocksForUser(user.id).map((u) => u.lesson_slug);
  return NextResponse.json({
    user: {
      id: user.id,
      vk_id: user.vk_id,
      name: user.name,
      avatar: user.avatar,
    },
    unlocks,
  });
}

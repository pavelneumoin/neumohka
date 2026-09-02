import { getCurrentUser } from "@/lib/auth";
import { getLessonBySlug } from "@/lib/catalog";
import { addFavorite, removeFavorite } from "@/lib/store";
import {
  checkMutationRequest,
  checkRateLimit,
  jsonNoStore,
} from "@/lib/request-security";

type Context = { params: Promise<{ slug: string }> };

export async function PUT(request: Request, context: Context) {
  return changeFavorite(request, context, true);
}

export async function DELETE(request: Request, context: Context) {
  return changeFavorite(request, context, false);
}

async function changeFavorite(
  request: Request,
  context: Context,
  favorite: boolean
) {
  const rejected = checkMutationRequest(request, {
    rateScope: "favorites-ip",
    rateLimit: 240,
  });
  if (rejected) return rejected;

  const user = await getCurrentUser();
  if (!user) return jsonNoStore({ error: "authentication_required" }, 401);

  const limited = checkRateLimit(`favorites-user:${user.id}`, 120);
  if (limited) return limited;

  const { slug } = await context.params;
  if (!getLessonBySlug(slug)) {
    return jsonNoStore({ error: "lesson_not_found" }, 404);
  }
  if (favorite) addFavorite(user.id, slug);
  else removeFavorite(user.id, slug);

  return jsonNoStore({ favorite, slug });
}

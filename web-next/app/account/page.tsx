import { redirect } from "next/navigation";
import { AccountDashboard } from "@/components/account-dashboard";
import { getCurrentUser } from "@/lib/auth";
import { catalog } from "@/lib/catalog";
import { getFavoritesForUser, toPublicUser } from "@/lib/store";

export const metadata = {
  title: "Личный кабинет — Неумошка",
  description: "Избранные уроки и персональная библиотека материалов.",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const favoriteSlugs = new Set(
    getFavoritesForUser(user.id).map((favorite) => favorite.lesson_slug)
  );
  const favoriteLessons = catalog.lessons.filter((lesson) =>
    favoriteSlugs.has(lesson.slug)
  );

  return (
    <AccountDashboard
      user={toPublicUser(user)}
      favoriteLessons={favoriteLessons}
      totalLessons={catalog.lessons.length}
    />
  );
}

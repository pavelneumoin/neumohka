import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://neumoshka.ru";
const SITE_UPDATED_AT = new Date("2026-08-25T00:00:00+03:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/catalog", "/faq", "/contacts", "/privacy"];
  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "weekly" as const,
    })),
    ...catalog.lessons.map((lesson) => ({
      url: `${SITE_URL}/lesson/${lesson.slug}`,
      lastModified: SITE_UPDATED_AT,
      changeFrequency: "monthly" as const,
    })),
  ];
}

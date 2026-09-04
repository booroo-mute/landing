/** Canonical public URL (production: https://mute.ac). Override via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mute.ac";

/**
 * Дата последнего содержательного изменения главной страницы (для sitemap).
 * Обновлять вручную при правках текстов главной — НЕ использовать new Date():
 * «вечно свежий» lastModified подрывает доверие поисковиков к sitemap.
 */
export const HOME_UPDATED = "2026-09-04";

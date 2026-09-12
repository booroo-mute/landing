/** Canonical public URL (production: https://mute.ac). Override via NEXT_PUBLIC_SITE_URL. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mute.ac";

/**
 * Даты последнего содержательного изменения статических страниц (для sitemap
 * и dateModified в разметке). Обновлять вручную при правках текстов —
 * НЕ использовать new Date(): «вечно свежий» lastModified подрывает доверие
 * поисковиков к sitemap. У каждой посадочной своя дата, чтобы правка главной
 * не «обновляла» соседние страницы.
 */
export const HOME_UPDATED = "2026-09-13";
export const DISCORD_ALTERNATIVE_UPDATED = "2026-09-10";
export const VOICE_CHAT_UPDATED = "2026-09-13";
export const DOWNLOAD_UPDATED = "2026-09-13";
export const INSTALL_UPDATED = "2026-08-13";
export const LEGAL_UPDATED = "2026-09-13";

/** Дата публичного запуска беты (пост в t.me/mutecalls от 5 января 2026). */
export const PRODUCT_LAUNCHED = "2026-01-05";

/**
 * OG-картинка по умолчанию для страниц без своей графики. Страницы, которые
 * задают собственный openGraph, НЕ наследуют images из layout — без этой
 * константы у них не было og:image вовсе.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/open-graph.png",
  width: 1200,
  height: 630,
  alt: "Mute — голосовой чат для игр",
};

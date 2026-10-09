import { DOWNLOAD_CONFIG } from "./downloads";

/**
 * Голый адрес веб-версии: для llms.txt, FAQ и цели open_web (MetrikaGoals
 * ищет его подстрокой, поэтому query-параметры ему не мешают).
 */
export const WEB_APP_URL = DOWNLOAD_CONFIG.webVersion;

/**
 * Внутренний переход не является новой рекламной кампанией. Страница и
 * место клика передаются отдельно; исходный источник хранится first-party.
 *
 * page — идентификатор страницы: "home", "download", "games/steam";
 * placement — место: "hero-secondary", "cta-full", "body".
 */
export function webAppUrl(page: string, placement: string): string {
  const url = new URL(WEB_APP_URL);
  url.searchParams.set("mute_page", page);
  url.searchParams.set("mute_placement", placement);
  return url.toString();
}

/**
 * Для ссылок из markdown: адрес веб-версии получает контекст текущей страницы,
 * остальные ссылки не трогаем. Контент при этом остаётся с голым адресом.
 */
export function withWebAppUtm(
  href: string | undefined,
  page: string,
  placement = "body",
): string | undefined {
  if (!href || href.split(/[?#]/)[0] !== WEB_APP_URL || href.includes("mute_page=")) return href;
  return webAppUrl(page, placement);
}

/** "/" → "home", "/games/steam" → "games/steam" (для компонентов с usePathname). */
export function pageIdFromPath(pathname: string | null): string {
  const p = (pathname ?? "").replace(/^\/+|\/+$/g, "");
  return p || "home";
}

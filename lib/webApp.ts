import { DOWNLOAD_CONFIG } from "./downloads";

/**
 * Голый адрес веб-версии: для llms.txt, FAQ и цели open_web (MetrikaGoals
 * ищет его подстрокой, поэтому query-параметры ему не мешают).
 */
export const WEB_APP_URL = DOWNLOAD_CONFIG.webVersion;

/**
 * Ссылка в веб-версию с UTM. Счётчик Метрики общий с beta.mute.ac, поэтому
 * визит в приложении начинается с источника «mute.ac / landing», и цель
 * «Зарегистрировался» (она считается в приложении) раскладывается по
 * utm_content (страница лендинга) и utm_term (место на странице). Без этого
 * регистрации из органики по страницам было не посчитать.
 *
 * page — идентификатор страницы: "home", "download", "games/steam";
 * placement — место: "hero-secondary", "cta-full", "body".
 */
export function webAppUrl(page: string, placement: string): string {
  const url = new URL(WEB_APP_URL);
  url.searchParams.set("utm_source", "mute.ac");
  url.searchParams.set("utm_medium", "landing");
  url.searchParams.set("utm_campaign", page.split("/")[0] || "home");
  url.searchParams.set("utm_content", page);
  url.searchParams.set("utm_term", placement);
  return url.toString();
}

/**
 * Для ссылок из markdown: адрес веб-версии получает UTM текущей страницы,
 * остальные ссылки не трогаем. Контент при этом остаётся с голым адресом.
 */
export function withWebAppUtm(
  href: string | undefined,
  page: string,
  placement = "body",
): string | undefined {
  if (!href || !href.startsWith(WEB_APP_URL) || href.includes("utm_source=")) return href;
  return webAppUrl(page, placement);
}

/** "/" → "home", "/games/steam" → "games/steam" (для компонентов с usePathname). */
export function pageIdFromPath(pathname: string | null): string {
  const p = (pathname ?? "").replace(/^\/+|\/+$/g, "");
  return p || "home";
}

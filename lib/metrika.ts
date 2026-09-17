/**
 * Яндекс.Метрика (счётчик 108242058): отправка целей из клиентского кода.
 * tag.js подключается afterInteractive, поэтому в момент раннего useEffect
 * window.ym может ещё не существовать — тогда цель дожидается загрузки
 * (до ~5 секунд), а не теряется. Имена целей задокументированы в
 * docs/seo-deploy-checklist.md.
 */

export const METRIKA_COUNTER_ID = 108242058;

/**
 * Параметры визита, уходящие в init: счётчик общий с beta.mute.ac, и сегмент
 * «Лендинг» в Метрике строится по «Параметры визитов → site = landing», а не
 * по фильтру домена. Именно параметры визита, а не userParams: те живут у
 * посетителя и утащили бы метку в его визиты в веб-приложение.
 */
export const METRIKA_VISIT_PARAMS = { site: "landing" } as const;

export type MetrikaGoal =
  | "open_web"
  | "download_click"
  | "download_win"
  | "download_mac"
  | "telegram_click"
  | "guide_cta";

declare global {
  interface Window {
    ym?: (id: number, action: string, goalOrParams: string | Record<string, unknown>, params?: Record<string, unknown>) => void;
  }
}


export function ymReachGoal(goal: MetrikaGoal, params?: Record<string, unknown>, attempt = 0): void {
  if (typeof window === "undefined") return;
  if (typeof window.ym === "function") {
    window.ym(METRIKA_COUNTER_ID, "reachGoal", goal, params);
    return;
  }
  if (attempt < 10) {
    window.setTimeout(() => ymReachGoal(goal, params, attempt + 1), 500);
  }
}

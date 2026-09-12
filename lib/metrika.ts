/**
 * Яндекс.Метрика (счётчик 108242058): отправка целей из клиентского кода.
 * tag.js подключается afterInteractive, поэтому в момент раннего useEffect
 * window.ym может ещё не существовать — тогда цель дожидается загрузки
 * (до ~5 секунд), а не теряется. Имена целей задокументированы в
 * docs/seo-deploy-checklist.md.
 */

export const METRIKA_COUNTER_ID = 108242058;

export type MetrikaGoal =
  | "open_web"
  | "download_click"
  | "download_win"
  | "download_mac"
  | "telegram_click"
  | "guide_cta";

declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void;
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

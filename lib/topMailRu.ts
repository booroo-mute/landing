/**
 * Top.Mail.Ru (VK Ads) counter helper for the landing (counter id 3772222).
 * The counter is bootstrapped in app/layout.tsx; this module only fires
 * explicit conversion goals. _tmr is an array that buffers pushes until
 * code.js loads, so calling before load is safe.
 */

const COUNTER_ID = "3772222";

declare global {
  interface Window {
    _tmr?: Array<Record<string, unknown>>;
  }
}

export function tmrReachGoal(goal: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const tmr = window._tmr || (window._tmr = []);
  tmr.push({ type: "reachGoal", id: COUNTER_ID, goal, ...params });
}

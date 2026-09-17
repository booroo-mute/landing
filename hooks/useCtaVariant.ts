"use client";

import { useEffect, useSyncExternalStore } from "react";
import { CTA_TEST, type CtaVariant } from "@/lib/ctaTest";
import { ymParams } from "@/lib/metrika";

// Как в OSProvider: краулеры остаются на серверном варианте.
const BOT_UA = /bot|crawl|spider|lighthouse|headless|pagespeed/i;

let current: CtaVariant | null = null;
const listeners = new Set<() => void>();
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = (): CtaVariant => current ?? "control";
const getServerSnapshot = (): CtaVariant => "control";

/** Ветка из cookie, без назначения новой (для параметров целей). */
export function readCtaVariant(): CtaVariant | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${CTA_TEST.cookie}=(control|web)`));
  return m ? (m[1] as CtaVariant) : null;
}

function assignVariant(): CtaVariant {
  const existing = readCtaVariant();
  if (existing) return existing;
  const v: CtaVariant = crypto.getRandomValues(new Uint8Array(1))[0] < 128 ? "web" : "control";
  document.cookie = `${CTA_TEST.cookie}=${v}; Max-Age=2592000; Path=/; SameSite=Lax`;
  return v;
}

/**
 * Ветка теста для текущего посетителя. При SSR и до гидрации всегда control,
 * поэтому разметка сервера и клиента совпадает; переключение происходит в
 * том же проходе, где HeroBlock уже перерисовывается после определения ОС.
 */
export function useCtaVariant(): CtaVariant {
  const variant = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (current !== null || !CTA_TEST.active) return;
    if (new Date().toISOString().slice(0, 10) > CTA_TEST.until) return;
    if (BOT_UA.test(navigator.userAgent)) return;
    current = assignVariant();
    ymParams({ cta_variant: current });
    listeners.forEach((l) => l());
  }, []);

  return variant;
}

/**
 * Тест «браузер первым» на главной: половине новых посетителей главная кнопка
 * hero ведёт в веб-версию, второй половине, как сейчас, на /download.
 * Ветка живёт в cookie и уходит в Метрику параметром визита cta_variant, а в
 * ссылке на веб-версию — как utm_term (hero-primary-web / hero-secondary), по
 * которому в приложении делится цель «Зарегистрировался». SSR и краулеры
 * всегда получают control. Выключить: active: false.
 */
export const CTA_TEST = { active: true, cookie: "mute_cta", until: "2026-10-05" } as const;

export type CtaVariant = "control" | "web";

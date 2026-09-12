"use client";

import { useEffect } from "react";
import { ymReachGoal, type MetrikaGoal } from "@/lib/metrika";
import { tmrReachGoal } from "@/lib/topMailRu";

// Единый обработчик целей по кликам на всех страницах. Цели:
//   open_web       — любая ссылка на веб-версию («Открыть в браузере», «Начать общаться»)
//   download_click — переход на /download
//   download_win / download_mac — прямая ссылка на установщик (клик; авторедирект
//                    на /download шлёт те же цели сам, см. DownloadClient)
//   telegram_click — канал или бот поддержки в Telegram
//   guide_cta      — клик внутри CTA-блока статьи/гайда (data-goal="guide_cta")
// Автоцель Метрики «Скачивание файла» не ловит редирект через location.href,
// поэтому скачивания считаем явно.
export default function MetrikaGoals() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const goals: MetrikaGoal[] = [];

      if (href.includes("beta.mute.ac/welcome")) goals.push("open_web");
      else if (href === "/download") goals.push("download_click");
      else if (/\.exe(\?|$)/.test(href)) goals.push("download_win");
      else if (/\.dmg(\?|$)/.test(href)) goals.push("download_mac");
      else if (href.includes("t.me/")) goals.push("telegram_click");

      if (target?.closest?.('[data-goal="guide_cta"]')) goals.push("guide_cta");

      for (const goal of goals) {
        ymReachGoal(goal, { href });
        if (goal === "open_web") tmrReachGoal("open_web");
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";

const COUNTER_ID = 108242058;

declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string) => void;
  }
}

// Единый обработчик целей Метрики: клик по любой ссылке на веб-версию
// (все кнопки «Открыть в браузере» / «Начать общаться» на всех страницах)
// отправляет событие open_web. Скачивания установщиков считает автоцель
// «Скачивание файла», отдельное событие им не нужно.
export default function MetrikaGoals() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      if (href.includes("beta.mute.ac/welcome")) {
        window.ym?.(COUNTER_ID, "reachGoal", "open_web");
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

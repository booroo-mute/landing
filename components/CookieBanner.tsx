"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "mute_cookies_ok";

// Информационный баннер о cookie. Счётчики аналитики от него не зависят:
// согласно политике (§8), продолжение использования сайта означает согласие.
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // приватный режим: скрываем хотя бы до конца сессии
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-[400px] z-50 bg-background-tertiary border border-[#1F1F1F] p-4 md:p-5 flex items-center gap-4 md:gap-5">
      <p className="body-text text-text-secondary">
        Пользуясь нашим сайтом, вы соглашаетесь с тем, что{" "}
        <Link href="/privacy" className="underline hover:text-accent transition-colors">
          мы используем cookies
        </Link>
      </p>
      <button
        type="button"
        onClick={accept}
        className="body-text text-text-primary shrink-0 border border-[#1F1F1F] bg-background-primary px-5 py-3 hover:bg-white/5 transition-colors cursor-pointer"
      >
        Окей
      </button>
    </div>
  );
}

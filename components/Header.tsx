"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ButtonPrimary from "./ButtonPrimary";
import { useOS } from "@/components/OSProvider";
import { webAppUrl, pageIdFromPath } from "@/lib/webApp";

export default function Header() {
  const os = useOS();
  const isMobile = os === "mobile" || os === "other";
  const icon = os === "macos" ? "/macos.svg" : "/windows.svg";
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  };

  return (
    <header className="sticky top-0 bg-background-primary z-50">
      <div className="container h-[64px] md:h-[72px] lg:h-[80px] flex items-center justify-between">
        <Link href="/" onClick={handleLogoClick} className="shrink-0">
          <Image src="/logo.svg" alt="Mute — на главную" width={92} height={24} className="w-[72px] md:w-[82px] lg:w-[92px] h-auto" />
        </Link>
        <div className="flex items-center gap-3 md:gap-6">
          {/* Главная ссылка на хаб под «голосовой чат» (71% показов в GSC на
              27.09). На узких экранах прячем, чтобы шапка не переносилась;
              в DOM ссылка остаётся и видна краулерам. */}
          <Link href="/voice-chat" className="hidden md:block body-text text-text-secondary hover:text-accent transition-colors whitespace-nowrap">
            Голосовой чат
          </Link>
          <Link href="/games" className="hidden min-[380px]:block body-text text-text-secondary hover:text-accent transition-colors whitespace-nowrap">
            Для игр
          </Link>
          <Link href="/blog" className="hidden sm:block body-text text-text-secondary hover:text-accent transition-colors whitespace-nowrap">
            Блог
          </Link>
          <a href="https://t.me/mutecalls" target="_blank" rel="noopener noreferrer" className="hidden sm:block body-text text-text-secondary hover:text-accent transition-colors whitespace-nowrap">
            Мы в Telegram
          </a>
          {isMobile ? (
            <ButtonPrimary href={webAppUrl(pageIdFromPath(pathname), "header")} target="_blank" className="whitespace-nowrap max-sm:px-3">Открыть Mute</ButtonPrimary>
          ) : (
            <ButtonPrimary icon={icon} href="/download" placement="header">Скачать</ButtonPrimary>
          )}
        </div>
      </div>
    </header>
  );
}

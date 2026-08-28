"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ButtonPrimary from "./ButtonPrimary";
import { useOS } from "@/components/OSProvider";

export default function Header() {
  const os = useOS();
  const isMobile = os === "mobile";
  const icon = os === "macos" ? "/macos.svg" : "/windows.svg";
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 bg-background-primary z-50">
      <div className="container h-[64px] md:h-[72px] lg:h-[80px] flex items-center justify-between">
        <Link href="/" onClick={handleLogoClick}>
          <Image src="/logo.svg" alt="Mute — на главную" width={92} height={24} className="w-[72px] md:w-[82px] lg:w-[92px] h-auto" />
        </Link>
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/blog" className="body-text text-text-secondary hover:text-accent transition-colors whitespace-nowrap">
            Блог
          </Link>
          <a href="https://t.me/mutecalls" target="_blank" rel="noopener noreferrer" className="hidden sm:block body-text text-text-secondary hover:text-accent transition-colors whitespace-nowrap">
            Мы в Telegram
          </a>
          {isMobile ? (
            <ButtonPrimary href="https://beta.mute.ac/welcome" target="_blank">Начать общаться</ButtonPrimary>
          ) : (
            <ButtonPrimary icon={icon} href="/download">Скачать</ButtonPrimary>
          )}
        </div>
      </div>
    </header>
  );
}

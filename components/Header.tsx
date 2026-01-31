"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "./ButtonPrimary";

export default function Header() {
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY > 536);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 bg-background-primary z-50">
      <div className="container h-[80px] flex items-center justify-between">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={103} height={27} />
        </Link>
        <a href="#" className="text-text-secondary hover:text-accent transition-colors">
          Телеграм канал
        </a>
        <div
          className={`transition-opacity duration-300 ${
            showButtons ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ButtonPrimary icon="/windows.svg">Скачать для Windows</ButtonPrimary>
        </div>
      </div>
    </header>
  );
}

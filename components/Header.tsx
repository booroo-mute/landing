"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
      <div className="container h-[104px] flex items-center justify-between">
        <Image src="/logo.svg" alt="Logo" width={103} height={27} />
        <div
          className={`transition-opacity duration-300 ${
            showButtons ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ButtonPrimary icon="/windows.svg">Скачать</ButtonPrimary>
        </div>
      </div>
    </header>
  );
}

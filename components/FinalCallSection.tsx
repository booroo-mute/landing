"use client";

import ButtonPrimary from "./ButtonPrimary";
import LinkText from "./LinkText";
import { useOS } from "@/hooks/useOS";

export default function FinalCallSection() {
  const os = useOS();
  const icon = os === "macos" ? "/macos.svg" : "/windows.svg";
  const label = os === "macos" ? "Скачать для Mac" : "Скачать для Windows";

  return (
    <section className="w-full max-w-[1440px] h-[400px] sm:h-[480px] md:h-[560px] lg:h-[640px] mx-auto mb-16 md:mb-20 lg:mb-[120px] relative overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat animate-zoom-in"
        style={{ backgroundImage: "url('/final-call-img.png')" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] sm:w-[85%] md:w-[75%] lg:w-[70%] h-[85%] md:h-[80%] bg-background-secondary flex flex-col items-center justify-center px-4 md:px-8 text-center">
        <h2 className="title-large">На старт, внимание, связь!</h2>
        <p className="title-medium text-text-secondary mt-3 md:mt-4 lg:mt-[16px] mb-6 md:mb-8 lg:mb-[40px]">Начните общаться в два клика</p>
        <ButtonPrimary icon={icon} href="/download">{label}</ButtonPrimary>
        <LinkText href="#" className="mt-3 md:mt-4">Другие платформы</LinkText>
      </div>
    </section>
  );
}

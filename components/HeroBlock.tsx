"use client";

import Image from "next/image";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import { useParallax } from "@/hooks/useParallax";
import { useOS } from "@/hooks/useOS";

export default function HeroBlock() {
  const offset = useParallax(0.08);
  const os = useOS();
  const icon = os === "macos" ? "/macos.svg" : "/windows.svg";
  const label = os === "macos" ? "Скачать для Mac" : "Скачать для Windows";

  return (
    <section className="w-full min-h-[480px] md:min-h-[560px] lg:h-[640px] bg-background-secondary flex flex-col lg:flex-row mt-8 md:mt-12 lg:mt-16">
      <div className="w-full lg:w-1/2 pt-8 px-4 pb-8 md:pt-10 md:px-8 md:pb-10 lg:pt-[44px] lg:pl-[44px] lg:pb-[44px] lg:pr-0 flex flex-col justify-between order-2 lg:order-1">
        <div>
          <h1 className="title-large">
            Голосовое общение<br />для игр, друзей, тебя
          </h1>
          <p className="title-medium text-text-secondary mt-4 md:mt-5 lg:mt-[24px]">
            Легче не бывает. Один клик — и ты на связи
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-3 mt-8 lg:mt-0 lg:gap-[12px]">
          <ButtonPrimary icon={icon} href="/download">{label}</ButtonPrimary>
          <ButtonSecondary>Открыть в браузере</ButtonSecondary>
        </div>
      </div>
      <div className="w-full lg:w-1/2 aspect-[16/9] lg:aspect-auto lg:h-full relative order-1 lg:order-2 overflow-hidden">
        <Image
          src="/hero-image.png"
          alt=""
          fill
          className="object-cover transition-transform duration-100 ease-out"
          style={{ transform: `translateY(${offset}px)` }}
        />
      </div>
    </section>
  );
}

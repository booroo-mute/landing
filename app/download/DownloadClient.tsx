"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useOS } from "@/components/OSProvider";
import { DOWNLOAD_CONFIG } from "@/lib/downloads";
import { webAppUrl } from "@/lib/webApp";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import { ymReachGoal } from "@/lib/metrika";
import { tmrReachGoal } from "@/lib/topMailRu";
import { captureCta } from "@/lib/acquisition";

export default function DownloadClient() {
  const os = useOS();
  const started = useRef(false);

  useEffect(() => {
    if (os === "other" || started.current) return;
    // Clean up before firing so development Strict Mode cannot duplicate a goal
    // or download. Waiting also gives the page and counters time to initialize.
    const timer = window.setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const placement = os === "mobile" ? "auto-redirect" : "auto-download";
      captureCta("download", placement);
      ymReachGoal(os === "mobile" ? "open_web" : os === "macos" ? "download_mac" : "download_win", {
        auto: true, page: "download", placement,
      });
      tmrReachGoal(os === "mobile" ? "open_app" : "download");
      window.location.href = os === "mobile"
        ? webAppUrl("download", placement)
        : DOWNLOAD_CONFIG.files[os];
    }, 500);
    return () => window.clearTimeout(timer);
  }, [os]);

  const desktop = os === "windows" || os === "macos";
  return (
    <section className="min-h-[70vh] flex flex-col lg:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-12 lg:py-16 gap-12 lg:gap-24">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-[560px]">
        <Link href="/">
          <Image src="/logo.svg" alt="Mute" width={92} height={24} className="mb-8" />
        </Link>
        <h1 className="title-large">Скачать Mute для Windows и macOS</h1>
        <p className="body-text text-text-secondary mt-4">
          {desktop
            ? "Скачивание начнётся автоматически. Если загрузка не началась, нажмите кнопку ниже."
            : os === "mobile"
              ? "Открываем Mute в браузере. Если переход не произошёл, нажмите кнопку ниже."
              : "Выберите версию для Windows или macOS либо откройте Mute в браузере."}
        </p>
        <div className="flex flex-col gap-5 mt-6 w-full">
          {(os === "windows" || os === "other") && (
            <div>
              <ButtonPrimary href={DOWNLOAD_CONFIG.files.windows} icon="/windows.svg" placement="download-windows">Скачать для Windows</ButtonPrimary>
              <p className="body-text text-text-secondary mt-2">Windows 10/11, 64 бит · версия {DOWNLOAD_CONFIG.versions.windows}</p>
            </div>
          )}
          {(os === "macos" || os === "other") && (
            <div>
              <ButtonSecondary href={DOWNLOAD_CONFIG.files.macos} icon="/macos.svg">Скачать для macOS</ButtonSecondary>
              <p className="body-text text-text-secondary mt-2">Apple Silicon (M1 и новее), macOS 14+ · версия {DOWNLOAD_CONFIG.versions.macos}</p>
            </div>
          )}
          <div>
            <ButtonSecondary href={webAppUrl("download", "browser")}>Открыть в браузере</ButtonSecondary>
            <p className="body-text text-text-secondary mt-2">Для Intel Mac, Linux и телефона — веб-версия без установки.</p>
          </div>
        </div>
        <p className="body-text text-text-secondary mt-6">Создайте аккаунт, добавьте друга по ссылке и позвоните. Каждому участнику нужны ник, почта и пароль; телефон не требуется.</p>
        <Link href={os === "macos" ? "/install/macos" : "/install"} className="body-text text-accent hover:underline mt-6">Инструкция по установке →</Link>
      </div>
      <div className="w-full max-w-[600px] lg:max-w-[500px]">
        <Image src="/hero-image-new1.webp" alt="Mute — голосовой чат для геймеров на Windows и macOS" width={600} height={400} sizes="(min-width: 1024px) 40vw, 100vw" className="w-full h-auto" />
      </div>
    </section>
  );
}

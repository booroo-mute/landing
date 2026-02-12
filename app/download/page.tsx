"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useOS, OS } from "@/components/OSProvider";
import { getDownloadUrl, DOWNLOAD_CONFIG } from "@/lib/downloads";
import LinkText from "@/components/LinkText";

function getDownloadInfo(os: OS): { url: string; label: string } | null {
  if (os === "windows") {
    return { url: DOWNLOAD_CONFIG.files.windows, label: "нажмите сюда" };
  }
  if (os === "macos") {
    return { url: DOWNLOAD_CONFIG.files.macos, label: "нажмите сюда" };
  }
  return null;
}

export default function DownloadPage() {
  const os = useOS();

  useEffect(() => {
    if (os === "mobile") {
      window.location.href = DOWNLOAD_CONFIG.webVersion;
      return;
    }

    const downloadInfo = getDownloadInfo(os);
    if (downloadInfo) {
      const timer = setTimeout(() => {
        window.location.href = downloadInfo.url;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [os]);

  if (os === "mobile") {
    return null;
  }

  const downloadInfo = getDownloadInfo(os);
  const isUnknownOS = os === "other";

  return (
    <main className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 md:px-8 lg:px-16 py-16 lg:py-0 gap-12 lg:gap-24">
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-[500px]">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="Mute"
            width={92}
            height={24}
            className="w-[72px] md:w-[82px] lg:w-[92px] h-auto mb-6 md:mb-8"
          />
        </Link>
        <h1 className="title-large">
          {isUnknownOS
            ? "Выбери версию для скачивания"
            : "Скачивание начнётся автоматически"}
        </h1>
        {isUnknownOS ? (
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <LinkText href={getDownloadUrl("windows")}>
              Скачать для Windows
            </LinkText>
            <LinkText href={getDownloadUrl("macos")}>
              Скачать для macOS
            </LinkText>
          </div>
        ) : (
          <p className="body-text text-text-secondary mt-4 md:mt-6">
            Если загрузка не началась,{" "}
            <LinkText href={downloadInfo!.url}>{downloadInfo!.label}</LinkText>
          </p>
        )}
        {os === "macos" && (
          <Link
            href="/install/macos"
            className="group mt-14 p-4 border border-[#1F1F1F] hover:bg-white/5 body-text text-text-secondary transition-colors flex items-center justify-between gap-6 w-full"
          >
            <div className="flex flex-col">
              <span className="text-accent">Инструкция по установке</span>
              <span>для macOS</span>
            </div>
            <span className="font-offbit text-2xl group-hover:text-accent transition-colors">→</span>
          </Link>
        )}
        <a
          href="https://t.me/mutecalls"
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${os !== "macos" ? "mt-14" : "mt-3"} p-4 border border-[#1F1F1F] hover:bg-white/5 body-text text-text-secondary transition-colors flex items-center justify-between gap-6 w-full`}
        >
          <div className="flex flex-col">
            <span className="text-accent-blue">Подпишитесь на наш Telegram</span>
            <span>чтобы не пропустить новости</span>
          </div>
          <span className="font-offbit text-2xl group-hover:text-accent transition-colors">→</span>
        </a>
      </div>
      <div className="w-full max-w-[600px] lg:max-w-[500px] xl:max-w-[600px]">
        <Image
          src="/hero-image-new.png"
          alt="Mute app"
          width={600}
          height={400}
          className="w-full h-auto"
        />
      </div>
    </main>
  );
}

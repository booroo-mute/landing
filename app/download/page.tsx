import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import Link from "next/link";
import DownloadClient from "./DownloadClient";
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SOFTWARE_APPLICATION_SCHEMA } from "@/lib/schema";
import { DOWNLOAD_CONFIG } from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Скачать Mute — голосовой чат для игр на Windows и macOS",
  description:
    "Скачайте Mute — российский аналог Discord без VPN. Бесплатная установка для Windows и macOS, голосовые звонки и чаты для геймеров.",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "Скачать Mute — голосовой чат для игр",
    description:
      "Российский аналог Discord без VPN. Установка для Windows и macOS, бесплатно.",
    url: "/download",
    images: [DEFAULT_OG_IMAGE],
  },
};

// Страница скачивания — единственная, где SoftwareApplication сопровождается
// прямыми ссылками на дистрибутивы: поисковики и LLM берут отсюда версию
// и ссылки. Шапки нет намеренно (страница-редирект), футер и крошки — есть,
// чтобы у краулера и у человека без JS был путь дальше по сайту.
export default function DownloadPage() {
  return (
    <>
      <JsonLd
        data={{
          ...SOFTWARE_APPLICATION_SCHEMA,
          downloadUrl: [DOWNLOAD_CONFIG.files.windows, DOWNLOAD_CONFIG.files.macos],
        }}
      />
      <main className="container">
        <div className="max-w-[1200px] mx-auto pt-6 md:pt-8">
          <Breadcrumbs items={[{ label: "Скачать" }]} />
        </div>
        <DownloadClient />
        <p className="max-w-[920px] mx-auto body-text text-text-secondary pb-12 md:pb-16 text-center">
          Текущая версия — {DOWNLOAD_CONFIG.version}, изменения по версиям в разделе{" "}
          <Link href="/releases" className="text-accent hover:underline">«Что нового»</Link>.
          Не хотите ничего устанавливать?{" "}
          <a href={DOWNLOAD_CONFIG.webVersion} className="text-accent hover:underline">Веб-версия</a>{" "}
          работает в браузере на компьютере и телефоне — подробнее на странице{" "}
          <Link href="/voice-chat" className="text-accent hover:underline">голосового чата онлайн</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import DownloadClient from "./DownloadClient";

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
  },
};

export default function DownloadPage() {
  return <DownloadClient />;
}

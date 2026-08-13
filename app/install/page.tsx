import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllInstallGuides } from "@/lib/install";

export const metadata: Metadata = {
  title: "Установка Mute — инструкции для Windows и macOS",
  description:
    "Пошаговые инструкции по установке голосового чата Mute: предупреждение SmartScreen на Windows и Gatekeeper на macOS.",
  alternates: { canonical: "/install" },
};

export default function InstallIndexPage() {
  const guides = getAllInstallGuides();

  return (
    <>
      <Header />
      <main className="container">
        <div className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Установка" }]} />
          <h1 className="title-large mt-6 md:mt-8">Установка Mute</h1>
          <p className="title-medium text-text-secondary mt-4">
            Выберите свою систему и следуйте короткой инструкции.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col gap-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/install/${guide.slug}`}
                className="group p-4 md:p-5 border border-[#1F1F1F] hover:bg-white/5 transition-colors flex items-center justify-between gap-6"
              >
                <div className="flex flex-col">
                  <span className="body-text text-accent">{guide.title}</span>
                  {guide.description && (
                    <span className="body-text text-text-secondary mt-1">{guide.description}</span>
                  )}
                </div>
                <span className="font-offbit text-2xl group-hover:text-accent transition-colors">→</span>
              </Link>
            ))}
          </div>
          <p className="body-text text-text-secondary mt-8 md:mt-10">
            Ещё нет установщика? Бесплатные сборки для Windows и macOS можно{" "}
            <a href="/download" className="text-accent hover:underline">
              скачать здесь
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReleaseCard from "@/components/ReleaseCard";
import { getAllReleases } from "@/lib/releases";

export const metadata: Metadata = {
  title: "Что нового в Mute — история обновлений",
  description:
    "Список обновлений голосового чата Mute: новые возможности, исправления и улучшения в каждой версии.",
  alternates: { canonical: "/releases" },
};

export default function ReleasesIndexPage() {
  const releases = getAllReleases();

  return (
    <>
      <Header />
      <main className="container">
        <div className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Что нового" }]} />
          <h1 className="title-large mt-6 md:mt-8">Что нового в Mute</h1>
          <p className="title-medium text-text-secondary mt-4">
            Крупные обновления Mute: что появилось и что стало лучше.
          </p>
          <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {releases.map((release) => (
              <ReleaseCard
                key={release.slug}
                slug={release.slug}
                date={release.date}
                title={release.title}
                summary={release.summary}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

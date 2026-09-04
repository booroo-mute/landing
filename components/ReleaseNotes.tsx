import Link from "next/link";
import ReleaseCard from "./ReleaseCard";
import { getAllReleases } from "@/lib/releases";

export default function ReleaseNotes() {
  const releases = getAllReleases();

  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px] bg-background-tertiary">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <h2 className="title-large">Что нового, Mute?</h2>
          <Link
            href="/releases"
            className="body-text text-accent hover:underline whitespace-nowrap"
          >
            Все обновления <span className="font-offbit">→</span>
          </Link>
        </div>
        <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {releases.slice(0, 3).map((release) => (
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
    </section>
  );
}

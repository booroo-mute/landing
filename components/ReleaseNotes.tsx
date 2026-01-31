import ReleaseCard from "./ReleaseCard";
import { getAllReleases } from "@/lib/releases";

export default function ReleaseNotes() {
  const releases = getAllReleases();

  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px] bg-background-primary">
      <div className="container">
        <h2 className="title-large">Что нового, Mute?</h2>
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

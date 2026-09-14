import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import JsonLd from "@/components/JsonLd";
import { getAllReleases } from "@/lib/releases";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { DEFAULT_OG_IMAGE, OG_SITE, SITE_URL, HOME_UPDATED } from "@/lib/site";

const TITLE = "Что нового в Mute: история обновлений";
const DESCRIPTION =
  "Список обновлений голосового чата Mute: новые возможности, исправления и улучшения в каждой версии.";

export const metadata: Metadata = {
  title: "Что нового в Mute — история обновлений",
  description: DESCRIPTION,
  alternates: { canonical: "/releases" },
  openGraph: {
    ...OG_SITE,
    title: TITLE,
    description: DESCRIPTION,
    url: "/releases",
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
};

export default function ReleasesIndexPage() {
  const releases = getAllReleases();
  const latest = releases
    .map((r) => r.updated ?? r.date)
    .sort()
    .at(-1);

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: "CollectionPage",
          url: `${SITE_URL}/releases`,
          name: TITLE,
          description: DESCRIPTION,
          dateModified: latest ?? HOME_UPDATED,
          mainEntity: itemListSchema(
            releases.map((r) => ({ url: `${SITE_URL}/releases/${r.slug}`, name: r.title })),
          ),
        })}
      />
      <Header />
      <main className="container">
        <div className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Что нового" }]} />
          <h1 className="title-large mt-6 md:mt-8">Что нового в Mute</h1>
          <p className="title-medium text-text-secondary mt-4">
            Крупные обновления Mute: что появилось и что стало лучше.
          </p>
          <h2 className="title-medium-semibold mt-10 md:mt-12">Все обновления</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {releases.map((release) => (
              <PostCard
                key={release.slug}
                href={`/releases/${release.slug}`}
                title={release.title}
                description={release.summary}
                date={release.date}
                image={release.image}
              />
            ))}
          </div>
          <h2 className="title-medium-semibold mt-10 md:mt-12">Как узнать о новом</h2>
          <p className="body-text text-text-secondary mt-3">
            Обновления выходят примерно раз в месяц. Анонсы появляются в{" "}
            <a
              href="https://t.me/mutecalls"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Telegram-канале
            </a>
            , а разборы отдельных изменений выходят в{" "}
            <Link href="/blog" className="text-accent hover:underline">
              блоге
            </Link>
            . Приложение само предлагает обновиться, когда выходит новая сборка.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

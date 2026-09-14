import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ButtonSecondary from "@/components/ButtonSecondary";
import { getAllGameGuides, type GameGuide, type GameTopic } from "@/lib/games";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { DEFAULT_OG_IMAGE, OG_SITE, SITE_URL, HOME_UPDATED } from "@/lib/site";

const TITLE = "Голосовой чат в играх: гайды по войсу";
const DESCRIPTION =
  "Как устроен голосовой чат в популярных играх и как созвониться с друзьями, когда встроенного войса нет или он не работает. Гайды от команды Mute.";

export const metadata: Metadata = {
  title: `${TITLE} — Mute`,
  description: DESCRIPTION,
  alternates: { canonical: "/games" },
  openGraph: {
    ...OG_SITE,
    title: TITLE,
    description: DESCRIPTION,
    url: "/games",
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
};

// Группы по frontmatter `topic`; гайд без поля попадает в «Настройку».
const GROUPS: Array<{ key: GameTopic; title: string; lead: string }> = [
  {
    key: "broken",
    title: "Не работает войс",
    lead: "Звонок висит на «Подключении», чат закрыт проверкой возраста, микрофон пропал после обновления. Разбираем по шагам, что проверить и как созвониться, пока игра молчит.",
  },
  {
    key: "setup",
    title: "Настройка",
    lead: "Где включить микрофон, какие клавиши и команды отвечают за войс, как заглушить одного тиммейта и почему пати созваниваются отдельно.",
  },
];

export default function GamesIndexPage() {
  const guides = getAllGameGuides();
  const byTopic = (topic: GameTopic): GameGuide[] =>
    guides.filter((g) => (g.topic ?? "setup") === topic);
  const latest = guides
    .map((g) => g.updated ?? g.date)
    .filter(Boolean)
    .sort()
    .at(-1);

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: "CollectionPage",
          url: `${SITE_URL}/games`,
          name: TITLE,
          description: DESCRIPTION,
          dateModified: latest ?? HOME_UPDATED,
          mainEntity: itemListSchema(
            GROUPS.flatMap((group) =>
              byTopic(group.key).map((g) => ({ url: `${SITE_URL}/games/${g.slug}`, name: g.title })),
            ),
          ),
        })}
      />
      <Header />
      <main className="container">
        <div className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Для игр" }]} />
          <h1 className="title-large mt-6 md:mt-8">Голосовой чат в играх</h1>
          <p className="title-medium text-text-secondary mt-4">
            В каждой игре войс устроен по-своему: где-то его нет вовсе, где-то
            он спрятан в настройках или закрыт проверкой возраста. Здесь мы
            разбираем, как общаться голосом в конкретных играх.
          </p>

          {GROUPS.map((group) => {
            const items = byTopic(group.key);
            if (items.length === 0) return null;
            return (
              <section key={group.key} className="mt-10 md:mt-12">
                <h2 className="title-medium-semibold">{group.title}</h2>
                <p className="body-text text-text-secondary mt-2">{group.lead}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  {items.map((guide) => (
                    <PostCard
                      key={guide.slug}
                      href={`/games/${guide.slug}`}
                      title={guide.title}
                      description={guide.description}
                      date={guide.updated ?? guide.date}
                      image={guide.image}
                    />
                  ))}
                </div>
              </section>
            );
          })}

          <section className="mt-10 md:mt-12 border-t border-[#1F1F1F] pt-8 md:pt-10">
            <h2 className="title-medium-semibold">Вашей игры нет в списке?</h2>
            <p className="body-text text-text-secondary mt-3">
              Способ один для любой игры: созвониться в Mute рядом с ней. Звонок
              открывается в браузере или в приложении, друзей зовут по ссылке,
              а сама игра остаётся как есть. Для компании есть{" "}
              <Link href="/voice-chat/rooms" className="text-accent hover:underline">
                комнаты до 8 человек
              </Link>
              , для друга без ПК подойдёт{" "}
              <Link href="/voice-chat/phone" className="text-accent hover:underline">
                Mute на телефоне
              </Link>
              .
            </p>
            <div className="mt-6">
              <ButtonSecondary href="/voice-chat">Как созвониться в браузере</ButtonSecondary>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

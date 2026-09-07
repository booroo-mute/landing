import type { Metadata } from "next";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllGameGuides } from "@/lib/games";

export const metadata: Metadata = {
  title: "Голосовой чат в играх: гайды по войсу — Mute",
  description:
    "Как устроен голосовой чат в популярных играх и как созвониться с друзьями, когда встроенного войса нет или он не работает. Гайды от команды Mute.",
  alternates: { canonical: "/games" },
};

export default function GamesIndexPage() {
  const guides = getAllGameGuides();

  return (
    <>
      <Header />
      <main className="container">
        <div className="pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Для игр" }]} />
          <h1 className="title-large mt-6 md:mt-8">Голосовой чат в играх</h1>
          <p className="title-medium text-text-secondary mt-4">
            В каждой игре войс устроен по-своему: где-то его нет вовсе, где-то
            он спрятан в настройках или закрыт проверкой возраста. Здесь мы
            разбираем, как общаться голосом в конкретных играх.
          </p>
          <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {guides.map((guide) => (
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
          <p className="body-text text-text-secondary mt-8 md:mt-10">
            Пока вашей игры здесь нет? Универсальный способ один:{" "}
            <Link href="/voice-chat" className="text-accent hover:underline">
              созвониться в браузере по ссылке
            </Link>{" "}
            и свернуть вкладку. Работает рядом с любой игрой.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

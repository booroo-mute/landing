import Link from "next/link";
import PostCard from "./PostCard";
import { getAllGameGuides } from "@/lib/games";

// Главная раньше не ссылалась ни на один гайд (только на хаб /games), а гайды
// дают большую часть поискового трафика и первыми ловят волны вроде Steam
// 20–22 сентября. Шесть последних по дате обновления, тот же PostCard.
export default function GameGuides() {
  const guides = getAllGameGuides().slice(0, 6);
  if (guides.length === 0) return null;

  return (
    <section className="w-full pb-16 md:pb-20 lg:!pb-[132px] bg-background-primary">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <h2 className="title-large">Голосовой чат в играх</h2>
          <Link
            href="/games"
            className="body-text text-accent hover:underline whitespace-nowrap"
          >
            Все гайды <span className="font-offbit">→</span>
          </Link>
        </div>
        <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {guides.map((guide) => (
            <PostCard
              key={guide.slug}
              href={`/games/${guide.slug}`}
              title={guide.title}
              description={guide.description}
              image={guide.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

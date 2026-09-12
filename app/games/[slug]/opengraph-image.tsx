import { getAllGameSlugs, getGameGuideBySlug } from "@/lib/games";
import { formatDate } from "@/lib/releases";
import { OG_SIZE, renderOgImage } from "@/lib/ogImage";

// Запасная OG-картинка для гайдов без собственной иллюстрации (ogImage во
// frontmatter имеет приоритет — Next подставляет файловую картинку только
// когда openGraph.images страницы не задан).
export const alt = "Mute — голосовой чат в играх";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllGameSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGameGuideBySlug(slug);
  const date = guide?.updated ?? guide?.date;
  return renderOgImage({
    title: guide?.title ?? "Голосовой чат в играх",
    kicker: "Гайд · голосовой чат в играх",
    date: date ? formatDate(date) : undefined,
  });
}

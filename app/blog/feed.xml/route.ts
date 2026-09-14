import { getAllBlogPosts } from "@/lib/blog";
import { getAllGameGuides } from "@/lib/games";
import { SITE_URL } from "@/lib/site";

// Одна лента на блог и гайды по играм: у них одна аудитория и одинаковые
// даты во frontmatter, а вторая лента только делила бы подписчиков.
// Релизы не включаем, это журнал изменений приложения.
export const dynamic = "force-static";

const MAX_ITEMS = 30;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(date: string): string {
  return new Date(`${date}T09:00:00+03:00`).toUTCString();
}

export async function GET() {
  const items = [
    ...getAllBlogPosts().map((p) => ({
      title: p.title,
      link: `${SITE_URL}/blog/${p.slug}`,
      description: p.description,
      date: p.date,
      updated: p.updated ?? p.date,
      category: "Блог",
    })),
    ...getAllGameGuides().map((g) => ({
      title: g.title,
      link: `${SITE_URL}/games/${g.slug}`,
      description: g.description ?? "",
      date: g.date ?? "",
      updated: g.updated ?? g.date ?? "",
      category: "Гайды по играм",
    })),
  ]
    .filter((item) => item.date)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .slice(0, MAX_ITEMS);

  const lastBuild = items.map((i) => i.updated).sort().at(-1) ?? items[0]?.date;

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mute: блог и гайды по голосовому чату</title>
    <link>${SITE_URL}/blog</link>
    <description>Статьи и гайды Mute: голосовой чат для игр, что делать, когда войс в игре не работает, и как созвониться с друзьями.</description>
    <language>ru</language>
    ${lastBuild ? `<lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>` : ""}
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${rfc822(item.date)}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <description>${escapeXml(item.description)}</description>
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { getAllGameGuides, getGameGuideBySlug } from "@/lib/games";

interface RelatedItem {
  href: string;
  title: string;
  description?: string;
}

interface RelatedLinksProps {
  /** Записи вида "blog/<slug>" | "games/<slug>" из frontmatter текущей статьи. */
  related?: string[];
  /** Текущая статья, чтобы не предлагать её саму себе. */
  current: `blog/${string}` | `games/${string}`;
  /** Сколько ссылок показать (frontmatter + добор из соседнего раздела). */
  limit?: number;
}

function resolve(ref: string): RelatedItem | null {
  const [section, slug] = ref.split("/");
  if (section === "blog") {
    const post = getBlogPostBySlug(slug);
    return post ? { href: `/blog/${slug}`, title: post.title, description: post.description } : null;
  }
  if (section === "games") {
    const guide = getGameGuideBySlug(slug);
    return guide ? { href: `/games/${slug}`, title: guide.title, description: guide.description } : null;
  }
  return null;
}

// Перелинковка блога и гайдов: явные ссылки из frontmatter, а недостающие
// места добираем свежими материалами из соседнего раздела (из гайда — посты
// блога, из поста — гайды). До этого гайды и посты друг на друга не ссылались.
export default function RelatedLinks({ related = [], current, limit = 3 }: RelatedLinksProps) {
  const seen = new Set<string>([`/${current}`]);
  const items: RelatedItem[] = [];

  for (const ref of related) {
    const item = resolve(ref);
    if (item && !seen.has(item.href)) {
      seen.add(item.href);
      items.push(item);
    }
  }

  if (items.length < limit) {
    const fallback: RelatedItem[] = current.startsWith("games/")
      ? getAllBlogPosts().map((p) => ({ href: `/blog/${p.slug}`, title: p.title, description: p.description }))
      : getAllGameGuides().map((g) => ({ href: `/games/${g.slug}`, title: g.title, description: g.description }));
    for (const item of fallback) {
      if (items.length >= limit) break;
      if (!seen.has(item.href)) {
        seen.add(item.href);
        items.push(item);
      }
    }
  }

  if (items.length === 0) return null;

  return (
    <aside aria-labelledby="related-heading" className="mt-10 md:mt-12 border-t border-[#1F1F1F] pt-6 md:pt-8">
      <h2 id="related-heading" className="title-medium-semibold">Читайте также</h2>
      <ul className="mt-4 flex flex-col gap-3 md:gap-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-accent hover:underline body-text">
              {item.title}
            </Link>
            {item.description && (
              <p className="body-text text-text-secondary mt-1 line-clamp-2">{item.description}</p>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

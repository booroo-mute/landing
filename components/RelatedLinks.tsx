import Link from "next/link";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { getAllGameGuides, getGameGuideBySlug } from "@/lib/games";
import { getReleaseBySlug } from "@/lib/releases";
import { getInstallGuideBySlug } from "@/lib/install";
import { getLandingBySlug } from "@/lib/landings";

interface RelatedItem {
  href: string;
  title: string;
  description?: string;
}

type Section = "blog" | "games" | "releases" | "install" | "landings";

interface RelatedLinksProps {
  /** Записи вида "<раздел>/<slug>" из frontmatter текущей страницы. */
  related?: string[];
  /** Текущая страница, чтобы не предлагать её саму себе. */
  current: `${Section}/${string}`;
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
  if (section === "releases") {
    const release = getReleaseBySlug(slug);
    return release ? { href: `/releases/${slug}`, title: release.title, description: release.summary } : null;
  }
  if (section === "install") {
    const guide = getInstallGuideBySlug(slug);
    return guide ? { href: `/install/${slug}`, title: guide.title, description: guide.description } : null;
  }
  if (section === "landings") {
    const landing = getLandingBySlug(slug);
    return landing ? { href: `/voice-chat/${slug}`, title: landing.title, description: landing.description } : null;
  }
  return null;
}

/** Куда ведёт текущая страница в разделе; посадочные и релизы лежат под другими путями. */
function currentHref(current: string): string {
  const [section, slug] = current.split("/");
  return section === "landings" ? `/voice-chat/${slug}` : `/${section}/${slug}`;
}

// Перелинковка: явные ссылки из frontmatter, а недостающие места добираем
// свежими материалами из соседнего раздела. Из гайда и релиза — посты блога,
// из поста и посадочной — гайды по играм (они приводят больше всего трафика).
export default function RelatedLinks({ related = [], current, limit = 3 }: RelatedLinksProps) {
  const seen = new Set<string>([currentHref(current)]);
  const items: RelatedItem[] = [];

  for (const ref of related) {
    const item = resolve(ref);
    if (item && !seen.has(item.href)) {
      seen.add(item.href);
      items.push(item);
    }
  }

  if (items.length < limit) {
    const wantGuides = current.startsWith("blog/") || current.startsWith("landings/");
    const fallback: RelatedItem[] = wantGuides
      ? getAllGameGuides().map((g) => ({ href: `/games/${g.slug}`, title: g.title, description: g.description }))
      : getAllBlogPosts().map((p) => ({ href: `/blog/${p.slug}`, title: p.title, description: p.description }));
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

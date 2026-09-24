import PostCard from "./PostCard";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { getAllGameGuides, getGameGuideBySlug } from "@/lib/games";
import { getReleaseBySlug } from "@/lib/releases";
import { getInstallGuideBySlug } from "@/lib/install";
import { getLandingBySlug } from "@/lib/landings";

interface RelatedItem {
  href: string;
  title: string;
  description?: string;
  date?: string;
  image?: string;
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
    return post ? { href: `/blog/${slug}`, title: post.title, description: post.description, date: post.updated ?? post.date, image: post.image } : null;
  }
  if (section === "games") {
    const guide = getGameGuideBySlug(slug);
    return guide ? { href: `/games/${slug}`, title: guide.title, description: guide.description, date: guide.updated ?? guide.date, image: guide.image } : null;
  }
  if (section === "releases") {
    const release = getReleaseBySlug(slug);
    return release ? { href: `/releases/${slug}`, title: release.title, description: release.summary, date: release.date, image: release.image } : null;
  }
  if (section === "install") {
    const guide = getInstallGuideBySlug(slug);
    return guide ? { href: `/install/${slug}`, title: guide.title, description: guide.description, date: guide.updated ?? guide.date } : null;
  }
  if (section === "landings") {
    const landing = getLandingBySlug(slug);
    return landing ? { href: `/voice-chat/${slug}`, title: landing.title, description: landing.description, date: landing.updated ?? landing.date, image: landing.image } : null;
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
      ? getAllGameGuides().map((g) => ({ href: `/games/${g.slug}`, title: g.title, description: g.description, date: g.updated ?? g.date, image: g.image }))
      : getAllBlogPosts().map((p) => ({ href: `/blog/${p.slug}`, title: p.title, description: p.description, date: p.updated ?? p.date, image: p.image }));
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
      {/* Те же карточки, что в блоке «Что нового, Mute?» на главной: колонка
          статьи не шире 920px, поэтому три карточки помещаются уже с md. */}
      <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {items.map((item) => (
          <PostCard
            key={item.href}
            href={item.href}
            title={item.title}
            description={item.description}
            date={item.date}
            image={item.image}
          />
        ))}
      </div>
    </aside>
  );
}

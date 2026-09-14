import fs from "fs";
import path from "path";
import matter from "gray-matter";

const landingsDirectory = path.join(process.cwd(), "content/landings");

/**
 * Посадочные под отдельные сценарии голосового чата (телефон, демонстрация
 * экрана, комнаты). Живут под /voice-chat/<slug>, чтобы читаться как один
 * раздел, а не как набор одинаковых страниц под разные запросы.
 */
export interface Landing {
  slug: string;
  title: string;
  /** Короткий заголовок для <title> и og:title (≤ 58 символов без « — Mute»); H1 остаётся title. */
  seoTitle?: string;
  description: string;
  date: string;
  updated?: string;
  /** Подпись в хлебных крошках, если title слишком длинный. */
  breadcrumb?: string;
  /** Связанные материалы для RelatedLinks ("blog/<slug>", "games/<slug>", …). */
  related?: string[];
  content: string;
}

export function getAllLandingSlugs(): string[] {
  if (!fs.existsSync(landingsDirectory)) {
    return [];
  }

  return fs
    .readdirSync(landingsDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getLandingBySlug(slug: string): Landing | null {
  const fullPath = path.join(landingsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    seoTitle: data.seoTitle,
    description: data.description,
    date: data.date,
    updated: data.updated,
    breadcrumb: data.breadcrumb,
    related: Array.isArray(data.related) ? data.related : undefined,
    content,
  };
}

export function getAllLandings(): Landing[] {
  return getAllLandingSlugs()
    .map((slug) => getLandingBySlug(slug))
    .filter((landing): landing is Landing => landing !== null)
    .sort((a, b) => (a.slug > b.slug ? 1 : -1));
}

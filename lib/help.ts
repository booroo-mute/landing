import fs from "fs";
import path from "path";
import matter from "gray-matter";

const helpDirectory = path.join(process.cwd(), "content/help");

/**
 * Статьи помощи по самому Mute: демонстрация экрана, звук, установка,
 * приглашения. Живут под /help/<slug>. Появились 27.09.2026 под брендовые
 * запросы вроде «в mute не работает демонстрация экрана» и «mute приложение
 * не выводит звук», на которые у сайта не было страницы.
 */
export interface HelpArticle {
  slug: string;
  title: string;
  /** Короткий заголовок для <title> и og:title (≤ 58 символов без « — Mute»); H1 остаётся title. */
  seoTitle?: string;
  description: string;
  date: string;
  updated?: string;
  /** Порядок в хабе /help, меньше выше. */
  order?: number;
  /** Связанные материалы для RelatedLinks ("blog/<slug>", "help/<slug>", …). */
  related?: string[];
  content: string;
}

export function getAllHelpSlugs(): string[] {
  if (!fs.existsSync(helpDirectory)) {
    return [];
  }

  return fs
    .readdirSync(helpDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getHelpArticleBySlug(slug: string): HelpArticle | null {
  const fullPath = path.join(helpDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));

  return {
    slug,
    title: data.title,
    seoTitle: data.seoTitle,
    description: data.description,
    date: data.date,
    updated: data.updated,
    order: typeof data.order === "number" ? data.order : undefined,
    related: Array.isArray(data.related) ? data.related : undefined,
    content,
  };
}

export function getAllHelpArticles(): HelpArticle[] {
  return getAllHelpSlugs()
    .map((slug) => getHelpArticleBySlug(slug))
    .filter((article): article is HelpArticle => article !== null)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99) || (a.slug > b.slug ? 1 : -1));
}

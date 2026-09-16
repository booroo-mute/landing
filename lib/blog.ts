import fs from "fs";
import path from "path";
import matter from "gray-matter";

const blogDirectory = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  /** Короткий заголовок для <title> и og:title (≤ 58 символов без « — Mute»); H1 остаётся title. */
  seoTitle?: string;
  description: string;
  date: string;
  updated?: string;
  /** Дата и одна строка статуса под H1 («Статус на 16 сентября: …») у страниц, которые обновляются по событиям. */
  statusDate?: string;
  statusLine?: string;
  image?: string;
  ogImage?: string;
  /** Связанные материалы: "blog/<slug>" или "games/<slug>" (см. RelatedLinks). */
  related?: string[];
  content: string;
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  return fs
    .readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(blogDirectory, `${slug}.md`);

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
    statusDate: data.statusDate,
    statusLine: data.statusLine,
    image: data.image,
    ogImage: data.ogImage,
    related: Array.isArray(data.related) ? data.related : undefined,
    content,
  };
}

export function getAllBlogPosts(): BlogPost[] {
  return getAllBlogSlugs()
    .map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

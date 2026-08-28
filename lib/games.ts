import fs from "fs";
import path from "path";
import matter from "gray-matter";

const gamesDirectory = path.join(process.cwd(), "content/games");

export interface GameGuide {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  updated?: string;
  content: string;
}

export function getGameGuideBySlug(slug: string): GameGuide | null {
  const fullPath = path.join(gamesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated,
    content,
  };
}

export function getAllGameSlugs(): string[] {
  if (!fs.existsSync(gamesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(gamesDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export function getAllGameGuides(): GameGuide[] {
  return getAllGameSlugs()
    .map((slug) => getGameGuideBySlug(slug))
    .filter((guide): guide is GameGuide => guide !== null);
}

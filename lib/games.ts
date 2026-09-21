import fs from "fs";
import path from "path";
import matter from "gray-matter";

const gamesDirectory = path.join(process.cwd(), "content/games");

export interface GameGuide {
  slug: string;
  title: string;
  /** Короткий заголовок для <title> и og:title (≤ 58 символов без « — Mute»); H1 остаётся title. */
  seoTitle?: string;
  description?: string;
  date?: string;
  updated?: string;
  /** Дата и одна строка статуса под H1 («Статус на 16 сентября: …») у страниц, которые обновляются по событиям. */
  statusDate?: string;
  statusLine?: string;
  /** Перед каким H2 (начало текста) вставлять компактный баннер; по умолчанию перед третьим. */
  ctaBefore?: string;
  image?: string;
  ogImage?: string;
  /** Группа на /games: «Не работает войс» (broken), «Нет встроенного войса» (novoice) или «Настройка» (setup, по умолчанию). */
  topic?: GameTopic;
  /** Связанные материалы: "blog/<slug>" или "games/<slug>" (см. RelatedLinks). */
  related?: string[];
  content: string;
}

export type GameTopic = "broken" | "setup" | "novoice";

/** Допустимые значения `topic`; тот же список в scripts/check-content.mjs, который ругается на всё остальное. */
export const GAME_TOPICS: readonly GameTopic[] = ["broken", "novoice", "setup"];


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
    seoTitle: data.seoTitle,
    description: data.description,
    date: data.date,
    updated: data.updated,
    statusDate: data.statusDate,
    statusLine: data.statusLine,
    ctaBefore: data.ctaBefore,
    image: data.image,
    ogImage: data.ogImage,
    topic: GAME_TOPICS.includes(data.topic) ? (data.topic as GameTopic) : undefined,
    related: Array.isArray(data.related) ? data.related : undefined,
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
    .filter((guide): guide is GameGuide => guide !== null)
    .sort((a, b) => {
      const aDate = a.updated ?? a.date ?? "";
      const bDate = b.updated ?? b.date ?? "";
      if (aDate !== bDate) return aDate > bDate ? -1 : 1;
      return (a.date ?? "") > (b.date ?? "") ? -1 : 1;
    });
}

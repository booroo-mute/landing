import fs from "fs";
import path from "path";
import matter from "gray-matter";

const releasesDirectory = path.join(process.cwd(), "content/releases");

export interface Release {
  slug: string;
  /** Номер сборки приложения; у продуктовых вех (фичи, волны надёжности) его нет */
  version?: string;
  date: string;
  /** Дата содержательной правки текста релиза (для dateModified и sitemap). */
  updated?: string;
  title: string;
  seoTitle?: string;
  summary: string;
  image?: string;
  /** Связанные материалы для RelatedLinks ("blog/<slug>", "games/<slug>", …). */
  related?: string[];
  content: string;
}

export function getAllReleases(): Release[] {
  if (!fs.existsSync(releasesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(releasesDirectory);

  const releases = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(releasesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return readRelease(slug, data, content);
    });

  return releases.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getReleaseBySlug(slug: string): Release | null {
  const fullPath = path.join(releasesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return readRelease(slug, data, content);
}

function readRelease(slug: string, data: Record<string, unknown>, content: string): Release {
  return {
    slug,
    version: data.version as string | undefined,
    date: data.date as string,
    updated: data.updated as string | undefined,
    title: data.title as string,
    seoTitle: data.seoTitle as string | undefined,
    summary: data.summary as string,
    image: data.image as string | undefined,
    related: Array.isArray(data.related) ? (data.related as string[]) : undefined,
    content,
  };
}

// «10 сентября 2026» — по правилам русской типографики месяц со строчной
// и без запятой перед годом.
export function formatDate(date: string): string {
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];
  const [year, month, day] = date.split("-");
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

export function getAllReleaseSlugs(): string[] {
  if (!fs.existsSync(releasesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(releasesDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

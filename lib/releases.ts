import fs from "fs";
import path from "path";
import matter from "gray-matter";

const releasesDirectory = path.join(process.cwd(), "content/releases");

export interface Release {
  slug: string;
  /** Номер сборки приложения; у продуктовых вех (фичи, волны надёжности) его нет */
  version?: string;
  date: string;
  title: string;
  summary: string;
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

      return {
        slug,
        version: data.version,
        date: data.date,
        title: data.title,
        summary: data.summary,
        content,
      };
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

  return {
    slug,
    version: data.version,
    date: data.date,
    title: data.title,
    summary: data.summary,
    content,
  };
}

export function formatDate(date: string): string {
  const months = [
    "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
  ];
  const [year, month, day] = date.split("-");
  return `${parseInt(day)} ${months[parseInt(month) - 1]}, ${year}`;
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

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const installDirectory = path.join(process.cwd(), "content/install");

export interface InstallGuide {
  slug: string;
  title: string;
  content: string;
}

export function getInstallGuideBySlug(slug: string): InstallGuide | null {
  const fullPath = path.join(installDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    content,
  };
}

export function getAllInstallSlugs(): string[] {
  if (!fs.existsSync(installDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(installDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

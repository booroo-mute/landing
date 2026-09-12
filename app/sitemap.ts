import { MetadataRoute } from "next";
import { getAllReleases } from "@/lib/releases";
import { getAllInstallGuides } from "@/lib/install";
import { getAllGameGuides } from "@/lib/games";
import { getAllBlogPosts } from "@/lib/blog";
import {
  SITE_URL,
  HOME_UPDATED,
  DISCORD_ALTERNATIVE_UPDATED,
  VOICE_CHAT_UPDATED,
  DOWNLOAD_UPDATED,
  INSTALL_UPDATED,
  LEGAL_UPDATED,
} from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const releases = getAllReleases();
  const releaseUrls: MetadataRoute.Sitemap = releases.map((release) => ({
    url: `${baseUrl}/releases/${release.slug}`,
    lastModified: new Date(release.date),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const installGuides = getAllInstallGuides();
  const installUrls: MetadataRoute.Sitemap = installGuides.map((guide) => ({
    url: `${baseUrl}/install/${guide.slug}`,
    lastModified: guide.date ? new Date(guide.date) : new Date(HOME_UPDATED),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const gameGuides = getAllGameGuides();
  const gameUrls: MetadataRoute.Sitemap = gameGuides.map((guide) => ({
    url: `${baseUrl}/games/${guide.slug}`,
    lastModified: new Date(guide.updated ?? guide.date ?? HOME_UPDATED),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPosts = getAllBlogPosts();
  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const latestRelease = releases[0]?.date;
  // Лента блога меняется и при обновлении старого поста, не только при новом
  const latestBlog = blogPosts
    .map((p) => p.updated ?? p.date)
    .sort()
    .at(-1);
  const latestGame = gameGuides
    .map((g) => g.updated ?? g.date)
    .filter(Boolean)
    .sort()
    .at(-1);

  return [
    {
      url: baseUrl,
      lastModified: new Date(HOME_UPDATED),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/discord-alternative`,
      lastModified: new Date(DISCORD_ALTERNATIVE_UPDATED),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/voice-chat`,
      lastModified: new Date(VOICE_CHAT_UPDATED),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/download`,
      lastModified: new Date(DOWNLOAD_UPDATED),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/install`,
      lastModified: new Date(INSTALL_UPDATED),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: latestGame ? new Date(latestGame) : new Date(HOME_UPDATED),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(LEGAL_UPDATED),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(LEGAL_UPDATED),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: latestBlog ? new Date(latestBlog) : new Date(HOME_UPDATED),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/releases`,
      lastModified: latestRelease ? new Date(latestRelease) : new Date(HOME_UPDATED),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...installUrls,
    ...gameUrls,
    ...blogUrls,
    ...releaseUrls,
  ];
}

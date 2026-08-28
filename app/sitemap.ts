import { MetadataRoute } from "next";
import { getAllReleases } from "@/lib/releases";
import { getAllInstallGuides } from "@/lib/install";
import { getAllBlogPosts } from "@/lib/blog";
import { SITE_URL, HOME_UPDATED } from "@/lib/site";

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

  const blogPosts = getAllBlogPosts();
  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const latestRelease = releases[0]?.date;
  const latestBlog = blogPosts[0]?.date;

  return [
    {
      url: baseUrl,
      lastModified: new Date(HOME_UPDATED),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/discord-alternative`,
      lastModified: new Date(HOME_UPDATED),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/voice-chat`,
      lastModified: new Date(HOME_UPDATED),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/download`,
      lastModified: new Date(HOME_UPDATED),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/install`,
      lastModified: new Date(HOME_UPDATED),
      changeFrequency: "monthly",
      priority: 0.6,
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
    ...blogUrls,
    ...releaseUrls,
  ];
}

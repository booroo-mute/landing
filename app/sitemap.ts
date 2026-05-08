import { MetadataRoute } from "next";
import { getAllReleases } from "@/lib/releases";
import { getAllInstallGuides } from "@/lib/install";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const releases = getAllReleases();
  const releaseUrls: MetadataRoute.Sitemap = releases.map((release) => ({
    url: `${baseUrl}/releases/${release.slug}`,
    lastModified: new Date(release.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const installGuides = getAllInstallGuides();
  const installUrls: MetadataRoute.Sitemap = installGuides.map((guide) => ({
    url: `${baseUrl}/install/${guide.slug}`,
    lastModified: guide.date ? new Date(guide.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const homeLastModified = releases[0]?.date
    ? new Date(releases[0].date)
    : new Date();

  return [
    {
      url: baseUrl,
      lastModified: homeLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/download`,
      lastModified: homeLastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...installUrls,
    ...releaseUrls,
  ];
}

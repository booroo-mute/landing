import { MetadataRoute } from "next";
import { getAllReleases } from "@/lib/releases";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const releases = await getAllReleases();
  const releaseUrls = releases.map((release) => ({
    url: `${baseUrl}/releases/${release.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/download`,
      lastModified: new Date(),
      priority: 0.9,
    },
    ...releaseUrls,
  ];
}

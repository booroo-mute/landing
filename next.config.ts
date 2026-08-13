import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // Вымышленные релизы 1.x удалены (реальная версия приложения — 0.x).
    // URL были в sitemap и могли попасть в индекс — отдаём 301 на список релизов.
    return ["1-0-0", "1-1-0", "1-2-0", "1-3-0"].map((slug) => ({
      source: `/releases/${slug}`,
      destination: "/releases",
      permanent: true,
    }));
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Заголовок X-Powered-By ничего не даёт, кроме подсказки сканерам уязвимостей.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      // Вымышленные релизы 1.x удалены (реальная версия приложения — 0.x).
      // URL были в sitemap и могли попасть в индекс — отдаём 301 на список релизов.
      ...["1-0-0", "1-1-0", "1-2-0", "1-3-0"].map((slug) => ({
        source: `/releases/${slug}`,
        destination: "/releases",
        permanent: true,
      })),
      // В логах встречаются /games/roblox~~~Голосовой и /games/robloxГолосовой —
      // хвост заголовка прилипает к ссылке при копировании из мессенджеров.
      // Точка исключена из «хвоста»: иначе под правило попадают картинки
      // /games/*.webp и *-og.jpg (редиректы срабатывают раньше статики).
      {
        source: "/games/:slug([a-z0-9-]+):junk([^a-z0-9\\-/.].*)",
        destination: "/games/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

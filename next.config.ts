import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Сборка идёт на продовой машине рядом с живыми звонками (4 ядра, mediasoup).
  // По умолчанию Next берёт под статическую генерацию все ядра минус одно, и
  // на графике хоста это минута под 80% CPU (24.09.2026). Два воркера вдвое
  // мягче, сборка на ~50 страниц дольше на секунды. Вместе с nice в deploy.sh.
  experimental: { cpus: 2 },
  // Заголовок X-Powered-By ничего не даёт, кроме подсказки сканерам уязвимостей.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Первая иллюстрация гайда идёт через next/image (мобильный LCP):
    // кэш оптимизатора держим столько же, сколько статику из public/.
    minimumCacheTTL: 2592000,
    // Иллюстрации гайдов живут с ?v=N (сброс кэша при замене файла); без
    // localPatterns next/image отказывается от src с query-строкой.
    localPatterns: [{ pathname: "/**" }],
  },
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      // Статика из public/ по умолчанию отдаётся с max-age=0 (перепроверка
      // по ETag на каждый запрос). Картинки и шрифты меняются редко; при
      // замене файла с тем же именем добавляйте ?v=N к URL (см. content/games).
      {
        source: "/:file(.*\\.(?:webp|jpe?g|png|svg|woff2|ico))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
    ];
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
      // Два поста сняты 14.09.2026 — адреса были в индексе,
      // ведём на ближайшие по смыслу страницы.
      { source: "/blog/zapret-dlya-discord-ne-rabotaet", destination: "/blog/discord-ne-rabotaet-segodnya", permanent: true },
      { source: "/blog/vpn-tolko-dlya-discord", destination: "/discord-alternative", permanent: true },
      // В логах встречаются /games/roblox~~~Голосовой и /games/robloxГолосовой —
      // хвост заголовка прилипает к ссылке при копировании из мессенджеров.
      // Точка исключена из «хвоста»: иначе под правило попадают картинки
      // /games/*.webp и *-og.jpg (редиректы срабатывают раньше статики).
      // 307, а не 308: постоянный редирект браузеры кешируют бессрочно, и
      // одна ошибка в правиле (как с картинками 13.09) залипает у посетителей.
      // То же для остальных разделов и корневых страниц: в Метрике видны
      // «/voice-chat отзывы» и «/voice-chat jnpsds», набранные в адресной строке.
      {
        source: "/:section(blog|games|voice-chat|install|releases)/:slug([a-z0-9-]+):junk([^a-z0-9\\-/.].*)",
        destination: "/:section/:slug",
        permanent: false,
      },
      {
        source: "/:page(voice-chat|download|discord-alternative|games|blog|install|releases):junk([^a-z0-9\\-/.].*)",
        destination: "/:page",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

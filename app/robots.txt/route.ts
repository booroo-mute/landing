import { SITE_URL } from "@/lib/site";

// robots.txt как route handler, а не app/robots.ts: типизированный
// MetadataRoute.Robots не умеет Clean-param, а Яндекс без него плодит в
// индексе дубли с ?ysclid= (клик-метка из выдачи) и utm-хвостами — такие
// URL уже видны в Метрике.
export const dynamic = "force-static";

const TRACKING_PARAMS = [
  "ysclid",
  "yclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
  "_ym_debug",
  "from",
].join("&");

// AI-краулеры перечислены явно, по одному блоку на каждого: часть из них
// ищет именно свою группу, а не `*`. YandexBot отдельно не выделяем: Яндекс
// берёт самую точную группу, и блок «YandexBot» без Clean-param отобрал бы
// его у основного робота.
const OPEN_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
];

export function GET() {
  const crawlerBlocks = OPEN_CRAWLERS.map((ua) => `User-agent: ${ua}\nAllow: /\n`).join("\n");

  const body = `${crawlerBlocks}
User-agent: *
Allow: /

User-agent: Yandex
Allow: /
Clean-param: ${TRACKING_PARAMS}

Sitemap: ${SITE_URL}/sitemap.xml

# Профиль продукта для AI-систем (llmstxt.org): ${SITE_URL}/llms.txt
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

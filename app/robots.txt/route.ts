import { SITE_URL } from "@/lib/site";

// robots.txt как route handler, а не app/robots.ts: типизированный
// MetadataRoute.Robots не умеет Clean-param, а Яндекс без него плодит в
// индексе дубли с ?ysclid= (клик-метка из выдачи) и utm-хвостами — такие
// URL уже видны в Метрике. AI-краулеры (GPTBot, OAI-SearchBot, PerplexityBot,
// ClaudeBot, bingbot, YandexBot) намеренно НЕ блокируются.
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

export function GET() {
  const body = `User-agent: *
Allow: /

User-agent: Yandex
Allow: /
Clean-param: ${TRACKING_PARAMS}

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

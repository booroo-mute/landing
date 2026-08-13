import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Единые правила для всех роботов. AI-краулеры (GPTBot, OAI-SearchBot,
// PerplexityBot, ClaudeBot, bingbot, YandexBot) намеренно НЕ блокируются:
// видимость в LLM-ответах требует доступа к контенту.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

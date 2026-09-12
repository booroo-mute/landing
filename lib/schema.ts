import { SITE_URL, HOME_UPDATED, PRODUCT_LAUNCHED } from "./site";
import { DOWNLOAD_CONFIG } from "./downloads";
import type { FaqItem } from "./faq";

// Стабильные @id, чтобы Organization / WebSite / SoftwareApplication
// ссылались друг на друга, а не дублировались как независимые сущности.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const SOFTWARE_APPLICATION_ID = `${SITE_URL}/#app`;

/** Издатель для Article/BlogPosting/TechArticle — ссылка на организацию. */
export const PUBLISHER_REF = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Mute",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.png`,
  },
};

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Mute",
  alternateName: ["Мьют", "Мут", "Муте"],
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    "Небольшая независимая команда, которая делает Mute — бесплатный голосовой чат для игр, работающий в России без VPN.",
  foundingDate: "2026",
  sameAs: [
    "https://t.me/mutecalls",
    "https://t.me/mute_calls_bot",
    "https://boosty.to/muteapp",
    "https://github.com/ylwsubmarine/mute-releases",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@mute.ac",
    contactType: "customer support",
    availableLanguage: ["Russian"],
  },
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Mute",
  url: SITE_URL,
  inLanguage: "ru-RU",
  publisher: { "@id": ORGANIZATION_ID },
};

// Общий объект SoftwareApplication — используется на главной, /download,
// /discord-alternative и /voice-chat.
export const SOFTWARE_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": SOFTWARE_APPLICATION_ID,
  name: "Mute",
  alternateName: ["Мьют", "Мут", "Муте"],
  url: SITE_URL,
  description:
    "Голосовой чат для геймеров — российский аналог Discord без VPN. Звонки 1:1 с видео, комнаты до 8 человек, демонстрация экрана, личные и групповые чаты.",
  applicationCategory: "CommunicationApplication",
  applicationSubCategory: "Voice chat",
  featureList: [
    "Голосовые звонки 1:1 без лимита времени",
    "Голосовые комнаты до 8 участников",
    "Видеозвонки со стилизацией под пиксельный ретро-телефон (отключается)",
    "Демонстрация экрана со звуком",
    "Личные и групповые текстовые чаты",
    "Работает в России без VPN",
    "Веб-версия в браузере без установки, в том числе на телефоне",
  ],
  operatingSystem: ["Windows", "macOS", "Web"],
  browserRequirements: "Браузер с поддержкой WebRTC: Chrome, Яндекс Браузер, Safari, Firefox",
  softwareVersion: DOWNLOAD_CONFIG.version,
  downloadUrl: `${SITE_URL}/download`,
  installUrl: `${SITE_URL}/install`,
  releaseNotes: `${SITE_URL}/releases`,
  datePublished: PRODUCT_LAUNCHED,
  dateModified: HOME_UPDATED,
  inLanguage: "ru-RU",
  image: `${SITE_URL}/open-graph.png`,
  screenshot: [`${SITE_URL}/hero-image-new1.webp`, `${SITE_URL}/calls.webp`, `${SITE_URL}/chat.webp`],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "RUB",
  },
  publisher: { "@id": ORGANIZATION_ID },
  author: { "@id": ORGANIZATION_ID },
};

export function faqPageSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

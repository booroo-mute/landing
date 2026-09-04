import { SITE_URL } from "./site";
import type { FaqItem } from "./faq";

// Общий объект SoftwareApplication — используется на главной и /discord-alternative.
export const SOFTWARE_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Mute",
  url: SITE_URL,
  description:
    "Голосовой чат для геймеров — российский аналог Discord без VPN. Звонки 1:1 с видео, комнаты до 8 человек, демонстрация экрана, личные и групповые чаты.",
  applicationCategory: "CommunicationApplication",
  featureList: [
    "Голосовые звонки 1:1 без лимита времени",
    "Голосовые комнаты до 8 участников",
    "Видеозвонки со стилизацией под пиксельный ретро-телефон (отключается)",
    "Демонстрация экрана",
    "Личные и групповые текстовые чаты",
    "Работает в России без VPN",
    "Веб-версия в браузере без установки",
  ],
  operatingSystem: "Windows, macOS",
  inLanguage: "ru-RU",
  image: `${SITE_URL}/open-graph.png`,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "RUB",
  },
  publisher: {
    "@type": "Organization",
    name: "Mute",
    url: SITE_URL,
  },
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

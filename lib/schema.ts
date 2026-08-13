import { SITE_URL } from "./site";
import type { FaqItem } from "./faq";

// Общий объект SoftwareApplication — используется на главной и /discord-alternative.
export const SOFTWARE_APPLICATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Mute",
  url: SITE_URL,
  description:
    "Голосовой чат для геймеров — российский аналог Discord без VPN. Звонки 1:1, комнаты до 8 человек, личные и групповые чаты.",
  applicationCategory: "CommunicationApplication",
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

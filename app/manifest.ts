import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mute — голосовой чат для игр",
    short_name: "Mute",
    description:
      "Российский голосовой чат для геймеров. Аналог Discord без VPN. Звонки 1:1, комнаты до 8 человек, личные и групповые чаты.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    lang: "ru-RU",
    icons: [
      {
        src: "/mute-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "206x206",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}

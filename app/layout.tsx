import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { OSProvider } from "@/components/OSProvider";

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mute — голосовое общение для игр и друзей",
  description: "Легкий голосовой чат без лишнего. Один клик — и ты на связи. Личные звонки и комнаты до 8 человек. Бесплатно.",
  openGraph: {
    title: "Mute — голосовое общение для игр и друзей",
    description: "Легкий голосовой чат без лишнего. Один клик — и ты на связи.",
    url: "https://mute.ac",
    siteName: "Mute",
    images: [
      {
        url: "https://mute.ac/open-graph.png",
        width: 1200,
        height: 630,
        alt: "Mute — голосовой чат",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mute — голосовое общение для игр и друзей",
    description: "Легкий голосовой чат без лишнего. Один клик — и ты на связи.",
    images: ["https://mute.ac/open-graph.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={`${golosText.variable} antialiased`}>
        <OSProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </OSProvider>
      </body>
    </html>
  );
}

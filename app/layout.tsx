import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { OSProvider } from "@/components/OSProvider";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

const golosText = Golos_Text({
  variable: "--font-golos",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Mute — голосовой чат для игр",
  description:
    "Mute — лёгкий голосовой чат для геймеров. Аналог Discord без VPN. Звонки 1:1, комнаты до 8 человек, личные и групповые чаты. Бесплатно.",
  keywords: [
    "голосовой чат для игр",
    "аналог дискорда",
    "альтернатива discord",
    "голосовой чат без VPN",
    "дискорд без VPN",
    "голосовая связь для геймеров",
    "бесплатный голосовой чат",
    "общение в играх",
    "приватный голосовой чат",
    "русский аналог Discord",
    "mute",
  ],
  openGraph: {
    title: "Mute — голосовой чат для игр",
    description:
      "Аналог Discord без VPN. Звонки 1:1, комнаты до 8 человек и чаты с друзьями. Бесплатно.",
    url: SITE_URL,
    siteName: "Mute",
    images: [
      {
        url: "/open-graph.png",
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
    title: "Mute — голосовой чат для игр",
    description:
      "Аналог Discord без VPN. Звонки 1:1, комнаты до 8 человек и чаты с друзьями. Бесплатно.",
    images: ["/open-graph.png"],
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
        <JsonLd
          data={[
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Mute",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              sameAs: [
                "https://t.me/mutecalls",
                "https://boosty.to/muteapp",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "hello@mute.ac",
                contactType: "customer support",
                availableLanguage: ["Russian"],
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Mute",
              url: SITE_URL,
              inLanguage: "ru-RU",
            },
          ]}
        />
        <OSProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </OSProvider>
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=108242058', 'ym');
              ym(108242058, 'init', {ssr:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
            `,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/108242058" style={{position:"absolute",left:"-9999px"}} alt="" />
          </div>
        </noscript>
      </body>
    </html>
  );
}

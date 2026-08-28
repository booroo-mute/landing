import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import Script from "next/script";
import "./globals.css";
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
  // Сниппет должен отсеивать нецелевой интент «чат-рулетки со незнакомцами»
  // ещё в выдаче: по данным Метрики такие визиты дают отказ ~50%+ и топят
  // поведенческие факторы. Поэтому «с друзьями» и «без случайных собеседников».
  title: "Mute — голосовой чат для игр с друзьями",
  description:
    "Бесплатный голосовой чат для геймеров: звонки один на один без лимита времени, комнаты до 8 человек, личные и групповые чаты. Работает в России без VPN, в браузере или в приложении для Windows и macOS. Без случайных собеседников.",
  keywords: [
    "голосовой чат для игр",
    "голосовой чат с другом",
    "войс чат онлайн",
    "аналог дискорда",
    "альтернатива discord",
    "дискорд без VPN",
    "mute",
  ],
  verification: {
    ...(process.env.NEXT_PUBLIC_YANDEX_VERIFICATION && {
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    }),
    ...(process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    }),
  },
  openGraph: {
    title: "Mute — голосовой чат для игр с друзьями",
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
    title: "Mute — голосовой чат для игр с друзьями",
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
        {/* OffBit подключён через @font-face в globals.css и не попадает под
            автопрелоад next/font — прелоадим вручную, чтобы заголовки не мигали */}
        <link
          rel="preload"
          href="/fonts/OffBit-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/OffBit-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
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
        <OSProvider>{children}</OSProvider>
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
        <Script
          id="top-mailru"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _tmr = window._tmr || (window._tmr = []);
              _tmr.push({id: "3772222", type: "pageView", start: (new Date()).getTime()});
              (function (d, w, id) {
                if (d.getElementById(id)) return;
                var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
                ts.src = "https://top-fwz1.mail.ru/js/code.js";
                var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
                if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
              })(document, window, "tmr-code");
            `,
          }}
        />
        <noscript>
          <div>
            <img src="https://top-fwz1.mail.ru/counter?id=3772222;js=na" style={{position:"absolute",left:"-9999px"}} alt="Top.Mail.Ru" />
          </div>
        </noscript>
      </body>
    </html>
  );
}

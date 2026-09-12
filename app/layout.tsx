import type { Metadata } from "next";
import { Golos_Text } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { OSProvider } from "@/components/OSProvider";
import CookieBanner from "@/components/CookieBanner";
import MetrikaGoals from "@/components/MetrikaGoals";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import { ORGANIZATION_SCHEMA, WEBSITE_SCHEMA } from "@/lib/schema";

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
  // Bing требует description до ~160 символов, иначе игнорирует его
  // и подставляет случайный текст со страницы (ловили сниппет из карточки релиза).
  description:
    "Бесплатный голосовой чат для игр с друзьями: звонки 1:1, комнаты до 8 человек, чаты. В браузере и приложении, в России без VPN. Без случайных собеседников.",
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
  // Только тип карточки: title/description/images Next подставляет из
  // openGraph каждой страницы. Если задать их здесь, дочерние страницы
  // унаследуют текст главной (ловили превью гайдов с описанием главной).
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Без scroll-smooth на html: CSS-плавность анимировала программный сброс
    // прокрутки при смене роута, и контент «уезжал» под sticky-шапку.
    // Плавный скролл логотипа задан в JS.
    <html lang="ru">
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
        <JsonLd data={[ORGANIZATION_SCHEMA, WEBSITE_SCHEMA]} />
        <OSProvider>{children}</OSProvider>
        <CookieBanner />
        <MetrikaGoals />
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

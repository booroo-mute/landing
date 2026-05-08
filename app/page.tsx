import type { Metadata } from "next";
import Header from "@/components/Header";
import HeroBlock from "@/components/HeroBlock";
import InfoBlock from "@/components/InfoBlock";
import CallsCards from "@/components/CallsCards";
import FeatureList from "@/components/FeatureList";
import ReleaseNotes from "@/components/ReleaseNotes";
import FinalCallSection from "@/components/FinalCallSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
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
        }}
      />
      <Header />
      <main>
        <div className="container">
          <HeroBlock />
          <InfoBlock />
        </div>
        <CallsCards />
        <FeatureList />
        <div className="container border-b border-[#1F1F1F]"></div>
        {/* <ReleaseNotes /> */}
        <FinalCallSection />
      </main>
      <Footer />
    </>
  );
}

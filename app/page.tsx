import type { Metadata } from "next";
import Header from "@/components/Header";
import HeroBlock from "@/components/HeroBlock";
import InfoBlock from "@/components/InfoBlock";
import CallsCards from "@/components/CallsCards";
import FeatureList from "@/components/FeatureList";
import ReleaseNotes from "@/components/ReleaseNotes";
import SeoIntro from "@/components/SeoIntro";
import SmoothScroll from "@/components/SmoothScroll";
import FaqSection from "@/components/FaqSection";
import FinalCallSection from "@/components/FinalCallSection";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { SOFTWARE_APPLICATION_SCHEMA } from "@/lib/schema";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={SOFTWARE_APPLICATION_SCHEMA} />
      <SmoothScroll />
      <Header />
      <main>
        <div className="container">
          <HeroBlock />
          <InfoBlock />
        </div>
        <CallsCards />
        <FeatureList />
        <ReleaseNotes />
        <SeoIntro />
        <FaqSection />
        <div className="container border-b border-[#1F1F1F]"></div>
        <FinalCallSection />
      </main>
      <Footer />
    </>
  );
}

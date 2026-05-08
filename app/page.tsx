import type { Metadata } from "next";
import Header from "@/components/Header";
import HeroBlock from "@/components/HeroBlock";
import InfoBlock from "@/components/InfoBlock";
import CallsCards from "@/components/CallsCards";
import FeatureList from "@/components/FeatureList";
import ReleaseNotes from "@/components/ReleaseNotes";
import FinalCallSection from "@/components/FinalCallSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
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

import Header from "@/components/Header";
import HeroBlock from "@/components/HeroBlock";
import InfoBlock from "@/components/InfoBlock";
import CallsCards from "@/components/CallsCards";
import FeatureList from "@/components/FeatureList";
import ReleaseNotes from "@/components/ReleaseNotes";
import FinalCallSection from "@/components/FinalCallSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container">
        <HeroBlock />
        <InfoBlock />
      </div>
      <CallsCards />
      <FeatureList />
      <div className="container border-b border-[#1F1F1F]"></div>
      <ReleaseNotes />
      <FinalCallSection />
      <Footer />
    </>
  );
}

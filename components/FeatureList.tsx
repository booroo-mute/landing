import FeatureItem from "./FeatureItem";

export default function FeatureList() {
  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px] bg-background-primary">
      <div className="container grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-6 lg:gap-5">
        <FeatureItem />
        <FeatureItem />
        <FeatureItem />
        <FeatureItem />
      </div>
    </section>
  );
}

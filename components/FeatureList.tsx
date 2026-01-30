import FeatureItem from "./FeatureItem";

export default function FeatureList() {
  return (
    <section className="w-full py-[120px] bg-background-primary">
      <div className="container flex gap-5">
        <FeatureItem />
        <FeatureItem />
        <FeatureItem />
        <FeatureItem />
      </div>
    </section>
  );
}

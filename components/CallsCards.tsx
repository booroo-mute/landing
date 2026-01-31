import CallCard from "./CallCard";

export default function CallsCards() {
  return (
    <section className="w-full py-16 md:py-20 lg:py-[120px] bg-background-tertiary">
      <div className="container">
        <h2 className="title-large">Говори и заговаривайся</h2>
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row gap-4 md:gap-6">
          <CallCard />
          <CallCard />
        </div>
      </div>
    </section>
  );
}

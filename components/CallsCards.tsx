import CallCard from "./CallCard";

export default function CallsCards() {
  return (
    <section className="w-full py-[120px] bg-background-tertiary">
      <div className="container">
        <h2 className="title-large">Говори и заговаривайся</h2>
        <div className="mt-8 flex gap-6">
          <CallCard />
          <CallCard />
        </div>
      </div>
    </section>
  );
}

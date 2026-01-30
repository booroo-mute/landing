import ReleaseCard from "./ReleaseCard";

export default function ReleaseNotes() {
  return (
    <section className="w-full py-[120px] bg-background-primary">
      <div className="container">
        <h2 className="title-large">Что нового, Mute?</h2>
        <div className="mt-8 flex gap-5">
          <ReleaseCard />
          <ReleaseCard />
          <ReleaseCard />
        </div>
      </div>
    </section>
  );
}

import CallCard from "./CallCard";

export default function CallsCards() {
  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px] bg-background-tertiary">
      <div className="container">
        <h2 className="title-large">Связь на любой случай</h2>
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row gap-4 md:gap-6">
          <CallCard
            title="Личные звонки"
            description="Не нужно искать канал или ждать остальных. Просто разговор один на один."
          />
          <CallCard
            title="Комнаты до 8 человек"
            description={"Один клик — и комната готова.\nЗаходи когда удобно."}
          />
        </div>
      </div>
    </section>
  );
}

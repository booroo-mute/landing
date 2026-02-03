import FeatureItem from "./FeatureItem";

export default function FeatureList() {
  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px] bg-background-primary">
      <div className="container grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-6 lg:gap-5">
        <FeatureItem
          title="Ничего лишнего"
          description="Минимум кнопок — максимум фокуса на игре."
        />
        <FeatureItem
          title="Бесплатно"
          description="Никаких подписок. Просто скачай и пользуйся."
        />
        <FeatureItem
          title="Стабильная связь"
          description="Голос без помех, связь без сюрпризов."
        />
        <FeatureItem
          title="Только свои"
          description="Никаких публичных серверов. Общение в своём кругу."
        />
      </div>
    </section>
  );
}

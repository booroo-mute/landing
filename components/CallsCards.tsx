import CallCard from "./CallCard";

export default function CallsCards() {
  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px] bg-background-tertiary">
      <div className="container">
        <h2 className="title-large">Связь на любой случай</h2>
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row gap-4 md:gap-6">
          <CallCard
            title="Звони как удобно"
            description="Разговоры 1-1 и комнаты до 8 участников"
            imageSrc="/calls.webp"
            imageAlt="Интерфейс звонка в Mute: голосовая комната с участниками"
          />
          <CallCard
            title="Общайся текстом"
            description="Личные сообщения и групповые чаты"
            imageSrc="/chat.webp"
            imageAlt="Текстовый чат в Mute: личные сообщения и групповые переписки"
          />
        </div>
      </div>
    </section>
  );
}

import CallCard from "./CallCard";

export default function CallsCards() {
  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px] bg-background-tertiary">
      <div className="container">
        {/* GSC 6.09–5.10.2026: «голосовой чат для игр» 88 показов на позиции
            10,3: фраза стояла в title, но ни в одном заголовке сайта. */}
        <h2 className="title-large">Голосовой чат для игр: связь на любой случай</h2>
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

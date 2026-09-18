import FeatureItem from "./FeatureItem";

// Карточки ведут на страницы, которые раскрывают тезис: раньше они были без
// ссылок, а посадочные /voice-chat/* не были связаны с главной вообще.
export default function FeatureList() {
  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px] bg-background-primary">
      <div className="container grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10 md:gap-6 lg:gap-5">
        <FeatureItem
          title="Ничего лишнего"
          description={"Минимум кнопок — максимум\nфокуса на игре."}
          icon="/minimalistic.svg"
          href="/voice-chat"
        />
        <FeatureItem
          title="Бесплатно"
          description={"Никаких подписок.\nПросто скачай и пользуйся."}
          icon="/free.svg"
          href="/download"
        />
        <FeatureItem
          title="Стабильно"
          description={"Голос без помех, связь\nбез сюрпризов."}
          icon="/stable.svg"
          href="/releases"
        />
        <FeatureItem
          title="Только свои"
          description={"Никаких публичных серверов.\nКомната до 8 человек по ссылке."}
          icon="/friends.svg"
          href="/voice-chat/rooms"
        />
        <FeatureItem
          title="Показать экран другу"
          description={"Экран или окно со звуком,\nдо 1080p при 60 кадрах."}
          icon="/screen-share.svg"
          href="/voice-chat/screen-share"
        />
        <FeatureItem
          title="На телефоне"
          description={"Та же веб-версия в Safari\nи Chrome, без приложения."}
          icon="/phone.svg"
          href="/voice-chat/phone"
        />
      </div>
    </section>
  );
}

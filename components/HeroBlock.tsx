import Image from "next/image";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";

export default function HeroBlock() {
  return (
    <section className="w-full h-[640px] bg-background-secondary flex">
      <div className="w-1/2 h-full pt-[44px] pl-[44px] pb-[44px] flex flex-col justify-between">
        <div>
          <h1 className="title-large">
            Голосовое общение<br />для игр, друзей, тебя
          </h1>
          <p className="title-medium text-text-secondary mt-[24px]">
            Доступно для Mac, Windows и в браузере
          </p>
        </div>
        <div className="flex gap-[12px]">
          <ButtonPrimary icon="/windows.svg">Скачать для Windows</ButtonPrimary>
          <ButtonSecondary>Открыть в браузере</ButtonSecondary>
        </div>
      </div>
      <div className="w-1/2 h-full relative">
        <Image src="/hero-image.png" alt="" fill className="object-cover" />
      </div>
    </section>
  );
}

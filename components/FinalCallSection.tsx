import ButtonPrimary from "./ButtonPrimary";

export default function FinalCallSection() {
  return (
    <section className="w-[1440px] h-[640px] mx-auto mb-[120px] relative">
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/final-call-img.png')" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[80%] bg-background-secondary flex flex-col items-center justify-center">
        <h2 className="title-large">На старт, внимание, связь!</h2>
        <p className="title-medium text-text-secondary mt-[16px] mb-[40px]">Начните общаться в два клика</p>
        <ButtonPrimary icon="/windows.svg">скачать</ButtonPrimary>
        <span className="body-text text-text-secondary mt-4">Другие платформы</span>
      </div>
    </section>
  );
}

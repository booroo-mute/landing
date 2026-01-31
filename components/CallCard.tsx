import Image from "next/image";

export default function CallCard() {
  return (
    <div className="w-full md:w-1/2 bg-background-secondary p-2 md:p-3">
      <Image
        src="/calls-card.png"
        alt="Calls card"
        width={700}
        height={400}
        className="w-full h-auto"
      />
      <div className="mt-6 md:mt-8 lg:mt-10 px-2 md:px-3 pb-6 md:pb-8 lg:pb-10 text-center">
        <h3 className="title-medium-semibold">Звонки 1-1</h3>
        <p className="body-text text-text-secondary mt-2 lg:w-[65%] lg:mx-auto">Не нужно искать нужный канал или ждать пока все соберутся. Просто разговор один на один.</p>
      </div>
    </div>
  );
}

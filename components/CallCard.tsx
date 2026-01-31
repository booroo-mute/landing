import Image from "next/image";

export default function CallCard() {
  return (
    <div className="w-1/2 bg-background-secondary p-3">
      <Image
        src="/calls-card.png"
        alt="Calls card"
        width={700}
        height={400}
        className="w-full h-auto"
      />
      <div className="mt-10 px-3 pb-10 text-center">
        <h3 className="title-medium-semibold">Звонки 1-1</h3>
        <p className="body-text text-text-secondary mt-2">Не нужно искать нужный канал<br />или ждать пока все соберутся.<br />Просто разговор один на один.</p>
      </div>
    </div>
  );
}

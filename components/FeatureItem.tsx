import Image from "next/image";

export default function FeatureItem() {
  return (
    <div className="w-full">
      <Image
        src="/feature.svg"
        alt="Feature"
        width={48}
        height={48}
        className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12"
      />
      <h3 className="title-medium-semibold mt-4 md:mt-6 lg:mt-8">Приватность</h3>
      <p className="body-text text-text-secondary mt-2">Не нужно искать нужный канал или ждать пока все соберутся.</p>
    </div>
  );
}

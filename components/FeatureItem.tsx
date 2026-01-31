import Image from "next/image";

export default function FeatureItem() {
  return (
    <div className="w-1/4">
      <Image
        src="/feature.svg"
        alt="Feature"
        width={48}
        height={48}
      />
      <h3 className="title-medium-semibold mt-8">Приватность</h3>
      <p className="body-text text-text-secondary mt-2">Не нужно искать нужный канал или ждать пока все соберутся.</p>
    </div>
  );
}

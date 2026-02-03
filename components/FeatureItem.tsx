import Image from "next/image";

interface FeatureItemProps {
  title: string;
  description: string;
  icon?: string;
}

export default function FeatureItem({ title, description, icon = "/feature.svg" }: FeatureItemProps) {
  return (
    <div className="w-full">
      <Image
        src={icon}
        alt={title}
        width={48}
        height={48}
        className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12"
      />
      <h3 className="title-medium-semibold mt-4 md:mt-6 lg:mt-8">{title}</h3>
      <p className="body-text text-text-secondary mt-2">{description}</p>
    </div>
  );
}

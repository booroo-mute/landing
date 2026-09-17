import Image from "next/image";
import Link from "next/link";

interface FeatureItemProps {
  title: string;
  description: string;
  icon?: string;
  /** Страница, которая раскрывает тезис карточки; без href карточка статичная. */
  href?: string;
}

export default function FeatureItem({ title, description, icon = "/feature.svg", href }: FeatureItemProps) {
  const body = (
    <>
      <Image
        src={icon}
        alt={title}
        width={48}
        height={48}
        className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12"
      />
      <h3 className="title-medium-semibold mt-4 md:mt-6 lg:mt-8 group-hover:text-accent transition-colors">{title}</h3>
      <p className="body-text text-text-secondary mt-2 whitespace-pre-line">{description}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="group block w-full">
        {body}
      </Link>
    );
  }
  return <div className="w-full">{body}</div>;
}

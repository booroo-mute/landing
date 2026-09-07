import Link from "next/link";
import { formatDate } from "@/lib/releases";

// Единая вертикальная карточка для всех лент: блог, гайды по играм,
// «Что нового» (страница и блок на главной). Постер опционален — статьи
// без графики показываются текстовой карточкой той же рамки.
interface PostCardProps {
  href: string;
  title: string;
  description?: string;
  date?: string;
  image?: string;
  imageAlt?: string;
}

export default function PostCard({
  href,
  title,
  description,
  date,
  image,
  imageAlt,
}: PostCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col border border-[#1F1F1F] transition-colors hover:bg-white/5"
    >
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={imageAlt ?? title}
          loading="lazy"
          className="w-full aspect-[3/2] object-cover"
        />
      )}
      <div className="p-4 md:p-5 flex flex-col gap-2">
        {date && (
          <p className="body-text text-text-secondary">{formatDate(date)}</p>
        )}
        <h3 className="title-medium-semibold">{title}</h3>
        {description && (
          <p className="body-text text-text-secondary line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}

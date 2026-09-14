import Image from "next/image";
import { getPublicImageSize } from "@/lib/imageSize";

interface MarkdownImageProps {
  src?: string | Blob;
  alt?: string;
  /** Первая картинка статьи: без lazy, с высоким приоритетом (кандидат в LCP). */
  eager?: boolean;
  className?: string;
}

// Картинки из markdown: width/height берём из файла, чтобы браузер
// зарезервировал место до загрузки и не сдвигал текст (CLS).
//
// Первая иллюстрация идёт через next/image: оптимизатор отдаёт телефону
// вариант 640–828 px в AVIF/WebP вместо исходных 1536 px, а `priority`
// добавляет <link rel="preload"> в <head>. До этого LCP гайда на мобильном
// был 4,8 с (Lighthouse, 14.09.2026). Остальные картинки остаются обычным
// <img loading="lazy">: их размер на LCP не влияет.
export default function MarkdownImage({ src, alt, eager = false, className = "w-full h-auto my-4 md:my-6" }: MarkdownImageProps) {
  const url = typeof src === "string" ? src : "";
  const size = url ? getPublicImageSize(url) : null;

  if (eager && size) {
    return (
      <Image
        src={url}
        alt={alt || ""}
        width={size.width}
        height={size.height}
        priority
        sizes="(min-width: 920px) 920px, 100vw"
        className={className}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt || ""}
      {...(size && { width: size.width, height: size.height })}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      {...(eager && { fetchPriority: "high" as const })}
      className={className}
    />
  );
}

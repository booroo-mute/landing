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
export default function MarkdownImage({ src, alt, eager = false, className = "w-full h-auto my-4 md:my-6" }: MarkdownImageProps) {
  const url = typeof src === "string" ? src : "";
  const size = url ? getPublicImageSize(url) : null;
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

import type { Components } from "react-markdown";
import MarkdownImage from "./MarkdownImage";

/**
 * Единый набор переопределений react-markdown для длинных статей
 * (блог и гайды по играм). `eagerSrc` — первая картинка статьи, её грузим
 * сразу, остальные лениво.
 */
export function articleMarkdownComponents(eagerSrc: string | null = null): Components {
  return {
    h2: ({ children }) => (
      <h2 className="title-medium-semibold mt-8 md:mt-10 mb-3 md:mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="title-medium-semibold mt-6 md:mt-8 mb-2 md:mb-3">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="body-text text-text-secondary mb-5 md:mb-6">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-3 md:space-y-4 mb-5">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-3 md:space-y-4 mb-5">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="body-text text-text-secondary">{children}</li>
    ),
    strong: ({ children }) => (
      <strong className="text-text-primary font-semibold">{children}</strong>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-accent hover:underline">{children}</a>
    ),
    code: ({ children }) => (
      <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">{children}</code>
    ),
    img: ({ src, alt }) => (
      <MarkdownImage src={src} alt={alt} eager={typeof src === "string" && src === eagerSrc} />
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse text-left">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="title-medium-semibold py-3 pr-4 border-b border-[#1F1F1F]">{children}</th>
    ),
    td: ({ children }) => (
      <td className="body-text text-text-secondary py-3 pr-4 border-b border-[#1F1F1F]">{children}</td>
    ),
  };
}

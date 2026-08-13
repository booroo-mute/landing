import JsonLd from "./JsonLd";
import { FAQ_ITEMS, type FaqItem } from "@/lib/faq";
import { faqPageSchema } from "@/lib/schema";

interface FaqSectionProps {
  /** Подмножество вопросов (по умолчанию — все) */
  items?: FaqItem[];
  /** Отключить JSON-LD (если FAQPage уже объявлен на странице) */
  withSchema?: boolean;
}

// Серверный компонент: текст вопросов и ответов присутствует в HTML
// (details/summary), краулеры видят его без JavaScript.
export default function FaqSection({ items = FAQ_ITEMS, withSchema = true }: FaqSectionProps) {
  return (
    <section className="w-full py-16 md:py-20 lg:!py-[132px] bg-background-tertiary">
      <div className="container">
        {withSchema && <JsonLd data={faqPageSchema(items)} />}
        <h2 className="title-large text-center">Частые вопросы</h2>
        <div className="mt-6 md:mt-8 max-w-[920px] mx-auto flex flex-col">
          {items.map((item) => (
            <details
              key={item.question}
              className="group border-b border-[#1F1F1F] py-4 md:py-5"
            >
              <summary className="title-medium-semibold cursor-pointer list-none flex items-center justify-between gap-4 marker:content-none">
                {item.question}
                <span
                  aria-hidden="true"
                  className="font-offbit text-2xl text-text-secondary group-open:rotate-45 transition-transform shrink-0"
                >
                  +
                </span>
              </summary>
              <p className="body-text text-text-secondary mt-3 md:mt-4 max-w-[820px]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

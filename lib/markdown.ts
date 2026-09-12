import type { FaqItem } from "./faq";

/**
 * Вытаскивает пары «**Вопрос?** Ответ» из markdown-секции частых вопросов
 * («## Коротко о частых вопросах», «## Частые вопросы …»). Используется,
 * чтобы объявить FAQPage-разметку из того же текста, который видит читатель,
 * без дублирования вопросов во frontmatter.
 */
export function extractFaq(markdown: string): FaqItem[] {
  const header = markdown.match(/^##\s+[^\n]*(?:частых вопросах|частые вопросы)[^\n]*\n/im);
  if (!header || header.index === undefined) return [];
  const rest = markdown.slice(header.index + header[0].length);
  const nextHeading = rest.search(/^##\s/m);
  const section = nextHeading === -1 ? rest : rest.slice(0, nextHeading);

  const items: FaqItem[] = [];
  const re = /^\*\*(.+?)\*\*\s+([^\n]+(?:\n(?!\n|\*\*)[^\n]+)*)/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section)) !== null) {
    const question = m[1].trim();
    const answer = stripInlineMarkdown(m[2]);
    if (question && answer) items.push({ question, answer });
  }
  return items;
}

/** Первая картинка статьи — кандидат в LCP, её грузим без lazy. */
export function firstImageSrc(markdown: string): string | null {
  const m = markdown.match(/!\[[^\]]*\]\(([^)\s]+)/);
  return m ? m[1] : null;
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

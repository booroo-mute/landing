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

interface SplitForCtaOptions {
  /** Перед каким по счёту H2 (0-based) вставлять баннер. */
  beforeHeading?: number;
  /** Минимум H2 в статье, чтобы разрез вообще имел смысл. */
  minHeadings?: number;
  /** Минимум слов в статье, чтобы разрез вообще имел смысл. */
  minWords?: number;
}

/**
 * Делит markdown на две части, чтобы шаблон мог вставить компактный
 * CTA-баннер посреди длинной статьи: react-markdown без плагинов не даёт
 * разместить компонент из текста. Режем перед третьим H2 (читатель успел
 * прочитать два раздела), заголовки внутри ```-блоков не считаем. Короткие
 * статьи не режем — у них хватает баннера в конце.
 */
export function splitForCta(
  markdown: string,
  { beforeHeading = 2, minHeadings = 5, minWords = 600 }: SplitForCtaOptions = {},
): [string, string] {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  if (words < minWords) return [markdown, ""];

  const lines = markdown.split("\n");
  const headingLines: number[] = [];
  let inFence = false;
  lines.forEach((line, i) => {
    if (/^```/.test(line)) {
      inFence = !inFence;
      return;
    }
    if (!inFence && /^##\s/.test(line)) headingLines.push(i);
  });
  if (headingLines.length < minHeadings) return [markdown, ""];

  const cut = headingLines[beforeHeading];
  return [lines.slice(0, cut).join("\n"), lines.slice(cut).join("\n")];
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

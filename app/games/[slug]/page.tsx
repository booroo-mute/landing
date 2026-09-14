import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import CtaBanner from "@/components/CtaBanner";
import RelatedLinks from "@/components/RelatedLinks";
import { articleMarkdownComponents } from "@/components/markdownComponents";
import { getGameGuideBySlug, getAllGameSlugs } from "@/lib/games";
import { extractFaq, firstImageSrc, splitForCta } from "@/lib/markdown";
import { faqPageSchema, PUBLISHER_REF } from "@/lib/schema";
import { formatDate } from "@/lib/releases";
import { SITE_URL, OG_SITE } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGameSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGameGuideBySlug(slug);
  if (!guide) return {};

  const url = `/games/${slug}`;
  const description =
    guide.description ?? `${guide.title} — гайд от команды Mute.`;

  const seoTitle = guide.seoTitle ?? guide.title;
  return {
    title: `${seoTitle} — Mute`,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...OG_SITE,
      title: seoTitle,
      description,
      url,
      type: "article",
      ...(guide.date && { publishedTime: guide.date }),
      ...(guide.updated && { modifiedTime: guide.updated }),
      ...(guide.ogImage && {
        images: [{ url: guide.ogImage, width: 1200, height: 630 }],
      }),
    },
  };
}

export default async function GameGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGameGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const url = `${SITE_URL}/games/${slug}`;
  const description =
    guide.description ?? `${guide.title} — гайд от команды Mute.`;
  // FAQPage объявляем только когда в тексте есть настоящий блок вопросов —
  // разметка без видимого контента считается спамом и у Google, и у Яндекса.
  const faq = extractFaq(guide.content);
  // Компактный баннер посреди длинного гайда; короткие получают только полный в конце.
  const [contentBefore, contentAfter] = splitForCta(guide.content);
  const markdownComponents = articleMarkdownComponents(firstImageSrc(guide.content));

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description,
          ...(guide.date && { datePublished: guide.date }),
          ...(guide.updated && { dateModified: guide.updated }),
          inLanguage: "ru-RU",
          url,
          mainEntityOfPage: url,
          ...(guide.image && { image: `${SITE_URL}${guide.image}` }),
          author: PUBLISHER_REF,
          publisher: PUBLISHER_REF,
        }}
      />
      {faq.length >= 2 && <JsonLd data={faqPageSchema(faq)} />}
      <Header />
      <main className="container">
        <article className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs
            items={[
              { href: "/games", label: "Для игр" },
              { label: guide.title },
            ]}
          />
          <h1 className="title-large mt-6 md:mt-8">{guide.title}</h1>
          {(guide.updated ?? guide.date) && (
            // Гайды обновляются еженедельно: дата видна читателю и совпадает
            // с dateModified в разметке.
            <p className="body-text text-text-secondary mt-3">
              {guide.updated && guide.updated !== guide.date
                ? `Обновлено ${formatDate(guide.updated)}`
                : `Опубликовано ${formatDate((guide.updated ?? guide.date)!)}`}
            </p>
          )}

          <div className="mt-6 md:mt-8 prose prose-invert max-w-none">
            <ReactMarkdown components={markdownComponents}>{contentBefore}</ReactMarkdown>
            {contentAfter && (
              <>
                <CtaBanner compact />
                <ReactMarkdown components={markdownComponents}>{contentAfter}</ReactMarkdown>
              </>
            )}
          </div>

          <CtaBanner />

          <RelatedLinks related={guide.related} current={`games/${slug}`} />
        </article>
      </main>
      <Footer />
    </>
  );
}

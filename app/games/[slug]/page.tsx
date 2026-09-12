import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import RelatedLinks from "@/components/RelatedLinks";
import { articleMarkdownComponents } from "@/components/markdownComponents";
import { getGameGuideBySlug, getAllGameSlugs } from "@/lib/games";
import { extractFaq, firstImageSrc } from "@/lib/markdown";
import { faqPageSchema, PUBLISHER_REF } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";

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

  return {
    title: `${guide.title} — Mute`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
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

          <div className="mt-6 md:mt-8 prose prose-invert max-w-none">
            <ReactMarkdown components={articleMarkdownComponents(firstImageSrc(guide.content))}>
              {guide.content}
            </ReactMarkdown>
          </div>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-3" data-goal="guide_cta">
            <ButtonPrimary href="https://beta.mute.ac/welcome" target="_blank">
              Открыть Mute в браузере
            </ButtonPrimary>
            <ButtonSecondary href="/download">Скачать приложение</ButtonSecondary>
          </div>

          <RelatedLinks related={guide.related} current={`games/${slug}`} />
        </article>
      </main>
      <Footer />
    </>
  );
}

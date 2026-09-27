import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import FaqSection from "@/components/FaqSection";
import { articleMarkdownComponents, articleRemarkPlugins } from "@/components/markdownComponents";
import { getHelpArticleBySlug, getAllHelpSlugs } from "@/lib/help";
import { splitFaq, firstImageSrc } from "@/lib/markdown";
import { PUBLISHER_REF, SOFTWARE_APPLICATION_ID } from "@/lib/schema";
import { SITE_URL, DEFAULT_OG_IMAGE, OG_SITE } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllHelpSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getHelpArticleBySlug(slug);
  if (!article) return {};

  const url = `/help/${slug}`;
  const seoTitle = article.seoTitle ?? article.title;
  return {
    title: `${seoTitle} — Mute`,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      ...OG_SITE,
      title: seoTitle,
      description: article.description,
      url,
      images: [DEFAULT_OG_IMAGE],
      type: "article",
      publishedTime: article.date,
      ...(article.updated && { modifiedTime: article.updated }),
    },
  };
}

const link = "text-accent hover:underline";

export default async function HelpArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getHelpArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const url = `${SITE_URL}/help/${slug}`;
  const { body, faq } = splitFaq(article.content);
  const markdownComponents = articleMarkdownComponents(firstImageSrc(article.content), `help/${slug}`);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          dateModified: article.updated ?? article.date,
          inLanguage: "ru-RU",
          url,
          mainEntityOfPage: url,
          about: { "@id": SOFTWARE_APPLICATION_ID },
          author: PUBLISHER_REF,
          publisher: PUBLISHER_REF,
        }}
      />
      <Header />
      <main className="container">
        <article className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs
            items={[
              { href: "/help", label: "Помощь" },
              { label: article.seoTitle ?? article.title },
            ]}
          />
          <h1 className="title-large mt-6 md:mt-8">{article.title}</h1>

          <div className="mt-6 md:mt-8 prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={articleRemarkPlugins} components={markdownComponents}>{body}</ReactMarkdown>
          </div>

          {/* Читатель статьи помощи обычно уже в Mute, поэтому вместо баннера
              с регистрацией даём живой канал поддержки. */}
          <aside className="mt-10 md:mt-12 border border-[#1F1F1F] p-5 md:p-6">
            <h2 className="title-medium-semibold">Не помогло?</h2>
            <p className="body-text text-text-secondary mt-3">
              Напишите в{" "}
              <a href="https://t.me/mute_calls_bot" className={link} target="_blank" rel="noopener noreferrer">
                бот поддержки
              </a>{" "}
              или на{" "}
              <a href="mailto:hello@mute.ac" className={link}>
                hello@mute.ac
              </a>
              : какая у вас система и браузер или приложение, что именно не работает и с какого момента. Все статьи помощи собраны{" "}
              <a href="/help" className={link}>
                на одной странице
              </a>
              .
            </p>
          </aside>

          <RelatedLinks related={article.related} current={`help/${slug}`} />
        </article>
      </main>
      {faq.length > 0 && <FaqSection items={faq} withSchema={faq.length >= 2} />}
      <Footer />
    </>
  );
}

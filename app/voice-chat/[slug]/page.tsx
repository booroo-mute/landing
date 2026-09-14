import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import CtaBanner from "@/components/CtaBanner";
import RelatedLinks from "@/components/RelatedLinks";
import FaqSection from "@/components/FaqSection";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import { articleMarkdownComponents } from "@/components/markdownComponents";
import { getLandingBySlug, getAllLandingSlugs } from "@/lib/landings";
import { splitFaq } from "@/lib/markdown";
import { SOFTWARE_APPLICATION_SCHEMA, webPageSchema } from "@/lib/schema";
import { SITE_URL, DEFAULT_OG_IMAGE, OG_SITE } from "@/lib/site";
import { DOWNLOAD_CONFIG } from "@/lib/downloads";

interface Props {
  params: Promise<{ slug: string }>;
}

// Посадочные под сценарии (телефон, демонстрация экрана, комнаты) живут в
// content/landings/*.md и рендерятся этим шаблоном под /voice-chat/<slug>:
// один раздел с общей крошкой, а не набор одинаковых страниц под разные
// запросы. FAQ страницы показывается через FaqSection без FAQPage-разметки:
// она объявлена только на главной.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const landing = getLandingBySlug(slug);
  if (!landing) return {};

  const url = `/voice-chat/${slug}`;
  const seoTitle = landing.seoTitle ?? landing.title;
  return {
    title: `${seoTitle} — Mute`,
    description: landing.description,
    alternates: { canonical: url },
    openGraph: {
      ...OG_SITE,
      title: seoTitle,
      description: landing.description,
      url,
      images: [DEFAULT_OG_IMAGE],
      type: "article",
      publishedTime: landing.date,
      ...(landing.updated && { modifiedTime: landing.updated }),
    },
  };
}

/** Текст до первого H2 — вводные абзацы, после них ставим кнопки. */
function splitIntro(markdown: string): [string, string] {
  const idx = markdown.search(/^##\s/m);
  if (idx === -1) return [markdown, ""];
  return [markdown.slice(0, idx), markdown.slice(idx)];
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const landing = getLandingBySlug(slug);

  if (!landing) {
    notFound();
  }

  const url = `${SITE_URL}/voice-chat/${slug}`;
  const { body, faq } = splitFaq(landing.content);
  const [intro, rest] = splitIntro(body);
  const markdownComponents = articleMarkdownComponents();

  return (
    <>
      <JsonLd
        data={[
          SOFTWARE_APPLICATION_SCHEMA,
          webPageSchema({
            url,
            name: landing.title,
            description: landing.description,
            datePublished: landing.date,
            dateModified: landing.updated ?? landing.date,
          }),
        ]}
      />
      <Header />
      <main className="container">
        <article className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs
            items={[
              { href: "/voice-chat", label: "Голосовой чат онлайн" },
              { label: landing.breadcrumb ?? landing.title },
            ]}
          />
          <h1 className="title-large mt-6 md:mt-8">{landing.title}</h1>

          <div className="mt-6 md:mt-8 prose prose-invert max-w-none">
            <ReactMarkdown components={markdownComponents}>{intro}</ReactMarkdown>
          </div>

          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
            <ButtonPrimary href={DOWNLOAD_CONFIG.webVersion} target="_blank">
              Открыть в браузере
            </ButtonPrimary>
            <ButtonSecondary href="/download">Скачать приложение</ButtonSecondary>
          </div>
          <p className="body-text text-text-secondary mt-3">
            Регистрация за минуту: ник, почта и пароль. Телефон не нужен.
          </p>

          {rest && (
            <div className="mt-8 md:mt-10 prose prose-invert max-w-none">
              <ReactMarkdown components={markdownComponents}>{rest}</ReactMarkdown>
            </div>
          )}

          <CtaBanner />

          <RelatedLinks related={landing.related} current={`landings/${slug}`} />
        </article>
      </main>
      {faq.length > 0 && <FaqSection items={faq} withSchema={false} />}
      <Footer />
    </>
  );
}

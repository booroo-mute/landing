import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import CtaBanner from "@/components/CtaBanner";
import RelatedLinks from "@/components/RelatedLinks";
import MarkdownImage from "@/components/MarkdownImage";
import { articleRemarkPlugins, tableMarkdownComponents } from "@/components/markdownComponents";
import { getInstallGuideBySlug, getAllInstallSlugs } from "@/lib/install";
import { PUBLISHER_REF, SOFTWARE_APPLICATION_ID } from "@/lib/schema";
import { SITE_URL, DEFAULT_OG_IMAGE, OG_SITE } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllInstallSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getInstallGuideBySlug(slug);
  if (!guide) return {};

  const url = `/install/${slug}`;
  const description =
    guide.description ??
    `${guide.title} — пошаговая инструкция для пользователей Mute.`;
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
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description,
    },
  };
}

export default async function InstallPage({ params }: Props) {
  const { slug } = await params;
  const guide = getInstallGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const url = `${SITE_URL}/install/${slug}`;
  const description =
    guide.description ??
    `${guide.title} — пошаговая инструкция для пользователей Mute.`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: guide.title,
          description,
          datePublished: guide.date,
          dateModified: guide.updated ?? guide.date,
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
              { href: "/install", label: "Установка" },
              { label: guide.title },
            ]}
          />
          <div className="mt-6 md:mt-8">
            <h1 className="title-large mt-2">{guide.title}</h1>
          </div>

          <div className="mt-6 md:mt-8 prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={articleRemarkPlugins}
              components={{
                h2: ({ children }) => (
                  <h2 className="title-medium-semibold mt-6 md:mt-8 mb-3 md:mb-4">{children}</h2>
                ),
                p: ({ children }) => (
                  <p className="body-text text-text-secondary mb-6 md:mb-8">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-3 md:space-y-4 mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-3 md:space-y-4 mb-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="body-text text-text-secondary">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="text-text-primary font-semibold">{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-accent-blue hover:underline">{children}</a>
                ),
                code: ({ children }) => (
                  <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm">{children}</code>
                ),
                img: ({ src, alt }) => <MarkdownImage src={src} alt={alt} />,
                ...tableMarkdownComponents,
              }}
            >
              {guide.content}
            </ReactMarkdown>
          </div>

          <CtaBanner
            heading="Установка не задалась? Mute работает и в браузере"
            text="Откройте веб-версию: звонки, комнаты и чаты в ней те же, ставить ничего не нужно. Установщики для Windows и macOS лежат на странице скачивания."
          />

          <RelatedLinks related={guide.related} current={`install/${slug}`} />
        </article>
      </main>
      <Footer />
    </>
  );
}

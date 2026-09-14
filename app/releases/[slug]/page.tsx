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
import { getReleaseBySlug, getAllReleaseSlugs, formatDate } from "@/lib/releases";
import { PUBLISHER_REF } from "@/lib/schema";
import { SITE_URL, OG_SITE } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllReleaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);
  if (!release) return {};

  const seoTitle = release.seoTitle ?? release.title;
  const title = release.version
    ? `${seoTitle} — Mute ${release.version}`
    : `${seoTitle} — Mute`;
  const url = `/releases/${slug}`;
  return {
    title,
    description: release.summary,
    alternates: { canonical: url },
    openGraph: {
      ...OG_SITE,
      title,
      description: release.summary,
      url,
      type: "article",
      publishedTime: release.date,
      ...(release.updated && { modifiedTime: release.updated }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: release.summary,
    },
  };
}

export default async function ReleasePage({ params }: Props) {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);

  if (!release) {
    notFound();
  }

  const url = `${SITE_URL}/releases/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: release.title,
          description: release.summary,
          datePublished: release.date,
          dateModified: release.updated ?? release.date,
          inLanguage: "ru-RU",
          url,
          mainEntityOfPage: url,
          // Без @id: у релиза своя версия, а общий узел приложения несёт текущую.
          about: {
            "@type": "SoftwareApplication",
            name: "Mute",
            ...(release.version && { softwareVersion: release.version }),
            operatingSystem: "Windows, macOS",
            applicationCategory: "CommunicationApplication",
          },
          author: PUBLISHER_REF,
          publisher: PUBLISHER_REF,
        }}
      />
      <Header />
      <main className="container">
        <article className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs
            items={[
              { href: "/releases", label: "Что нового" },
              { label: release.title },
            ]}
          />
          <div className="mt-6 md:mt-8">
            <p className="body-text text-text-secondary">{formatDate(release.date)}</p>
            <h1 className="title-large mt-2">{release.title}</h1>
          </div>

          <div className="mt-6 md:mt-8 prose prose-invert max-w-none">
            <ReactMarkdown
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
                li: ({ children }) => (
                  <li className="body-text text-text-secondary">{children}</li>
                ),
                img: ({ src, alt }) => <MarkdownImage src={src} alt={alt} />,
                video: ({ src }) => (
                  <video src={src} controls className="w-full my-4 md:my-6" />
                ),
              }}
            >
              {release.content}
            </ReactMarkdown>
          </div>

          <CtaBanner />

          <RelatedLinks related={release.related} current={`releases/${slug}`} />
        </article>
      </main>
      <Footer />
    </>
  );
}

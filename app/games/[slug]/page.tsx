import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ButtonPrimary from "@/components/ButtonPrimary";
import ButtonSecondary from "@/components/ButtonSecondary";
import { getGameGuideBySlug, getAllGameSlugs } from "@/lib/games";
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
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description,
      ...(guide.ogImage && { images: [guide.ogImage] }),
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
          author: {
            "@type": "Organization",
            name: "Mute",
            url: SITE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "Mute",
            url: SITE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${SITE_URL}/logo.png`,
            },
          },
        }}
      />
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
            <ReactMarkdown
              components={{
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
                  <ul className="list-disc list-inside space-y-2 mb-5">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-5">{children}</ol>
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
                  <img src={src} alt={alt || ""} loading="lazy" className="w-full my-4 md:my-6" />
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
              }}
            >
              {guide.content}
            </ReactMarkdown>
          </div>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-3">
            <ButtonPrimary href="https://beta.mute.ac/welcome" target="_blank">
              Открыть Mute в браузере
            </ButtonPrimary>
            <ButtonSecondary href="/download">Скачать приложение</ButtonSecondary>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

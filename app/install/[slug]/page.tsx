import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import { getInstallGuideBySlug, getAllInstallSlugs } from "@/lib/install";
import { SITE_URL } from "@/lib/site";

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

  return {
    title: `${guide.title} — Mute`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
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
          inLanguage: "ru-RU",
          url,
          mainEntityOfPage: url,
          about: {
            "@type": "SoftwareApplication",
            name: "Mute",
            applicationCategory: "CommunicationApplication",
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
          <div>
            <h1 className="title-large mt-2">{guide.title}</h1>
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
                  <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4">{children}</ol>
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
                img: ({ src, alt }) => (
                  <img src={src} alt={alt || ""} className="w-full my-4 md:my-6" />
                ),
              }}
            >
              {guide.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </>
  );
}

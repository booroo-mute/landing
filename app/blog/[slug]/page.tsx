import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/releases";
import { SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  const url = `/blog/${slug}`;
  return {
    title: `${post.title} — Mute`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      ...(post.updated && { modifiedTime: post.updated }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const url = `${SITE_URL}/blog/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          ...(post.updated && { dateModified: post.updated }),
          inLanguage: "ru-RU",
          url,
          mainEntityOfPage: url,
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
            items={[{ href: "/blog", label: "Блог" }, { label: post.title }]}
          />
          <div className="mt-6 md:mt-8">
            <p className="body-text text-text-secondary">{formatDate(post.date)}</p>
            <h1 className="title-large mt-2">{post.title}</h1>
          </div>

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
                img: ({ src, alt }) => (
                  <img src={src} alt={alt || ""} className="w-full my-4 md:my-6" />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          <p className="body-text text-text-secondary mt-8 md:mt-10 border-t border-[#1F1F1F] pt-6">
            Mute — бесплатный голосовой чат для игр, работает в России без VPN.{" "}
            <a href="/download" className="text-accent hover:underline">Скачать для Windows и macOS</a>{" "}
            или <a href="https://beta.mute.ac/welcome" className="text-accent hover:underline">открыть в браузере</a>.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { articleMarkdownComponents } from "@/components/markdownComponents";
import { getBlogPostBySlug, getAllBlogSlugs } from "@/lib/blog";
import { extractFaq, firstImageSrc } from "@/lib/markdown";
import { formatDate } from "@/lib/releases";
import { faqPageSchema, PUBLISHER_REF } from "@/lib/schema";
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
      // OG-картинка генерируется в ./opengraph-image.tsx, если во frontmatter
      // нет своей: у постов без графики иначе уезжала общая картинка главной.
      ...(post.ogImage && {
        images: [{ url: post.ogImage, width: 1200, height: 630 }],
      }),
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
  const faq = extractFaq(post.content);

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
          image: post.ogImage ? `${SITE_URL}${post.ogImage}` : `${url}/opengraph-image`,
          author: PUBLISHER_REF,
          publisher: PUBLISHER_REF,
        }}
      />
      {faq.length >= 2 && <JsonLd data={faqPageSchema(faq)} />}
      <Header />
      <main className="container">
        <article className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs
            items={[{ href: "/blog", label: "Блог" }, { label: post.title }]}
          />
          <div className="mt-6 md:mt-8">
            <p className="body-text text-text-secondary">
              {formatDate(post.date)}
              {post.updated && post.updated !== post.date && (
                <> · обновлено {formatDate(post.updated)}</>
              )}
            </p>
            <h1 className="title-large mt-2">{post.title}</h1>
          </div>

          <div className="mt-6 md:mt-8 prose prose-invert max-w-none">
            <ReactMarkdown components={articleMarkdownComponents(firstImageSrc(post.content))}>
              {post.content}
            </ReactMarkdown>
          </div>

          <p className="body-text text-text-secondary mt-8 md:mt-10 border-t border-[#1F1F1F] pt-6" data-goal="guide_cta">
            Mute — бесплатный голосовой чат для игр, работает в России без VPN.{" "}
            <a href="/download" className="text-accent hover:underline">Скачать для Windows и macOS</a>{" "}
            или <a href="https://beta.mute.ac/welcome" className="text-accent hover:underline">открыть в браузере</a>.
          </p>

          <RelatedLinks related={post.related} current={`blog/${slug}`} />
        </article>
      </main>
      <Footer />
    </>
  );
}

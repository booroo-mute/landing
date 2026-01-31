import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Header from "@/components/Header";
import { getReleaseBySlug, getAllReleaseSlugs, formatDate } from "@/lib/releases";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllReleaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ReleasePage({ params }: Props) {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);

  if (!release) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="container">
        <article className="max-w-[700px] mx-auto pt-[72px] pb-[80px]">
          <div>
            <p className="body-text text-text-secondary">{formatDate(release.date)}</p>
            <h1 className="title-large mt-2">{release.title}</h1>
          </div>

          <div className="mt-8 prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="title-medium-semibold mt-8 mb-4">{children}</h2>
                ),
                p: ({ children }) => (
                  <p className="body-text text-text-secondary mb-8">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="body-text text-text-secondary">{children}</li>
                ),
                img: ({ src, alt }) => (
                  <img src={src} alt={alt || ""} className="w-full rounded-lg my-6" />
                ),
                video: ({ src }) => (
                  <video src={src} controls className="w-full rounded-lg my-6" />
                ),
              }}
            >
              {release.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </>
  );
}

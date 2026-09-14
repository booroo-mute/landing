import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import JsonLd from "@/components/JsonLd";
import { getAllBlogPosts } from "@/lib/blog";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { DEFAULT_OG_IMAGE, OG_SITE, SITE_URL, HOME_UPDATED } from "@/lib/site";

const TITLE = "Блог Mute: про голосовое общение и игры";
const DESCRIPTION =
  "Статьи о голосовых чатах для игр: сравнения сервисов, инструкции и советы. Чем заменить Discord, как созваниваться в браузере и не только.";

export const metadata: Metadata = {
  title: "Блог Mute — про голосовое общение и игры",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    ...OG_SITE,
    title: TITLE,
    description: DESCRIPTION,
    url: "/blog",
    images: [DEFAULT_OG_IMAGE],
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const latest = posts
    .map((p) => p.updated ?? p.date)
    .sort()
    .at(-1);

  return (
    <>
      <JsonLd
        data={webPageSchema({
          type: "CollectionPage",
          url: `${SITE_URL}/blog`,
          name: TITLE,
          description: DESCRIPTION,
          dateModified: latest ?? HOME_UPDATED,
          mainEntity: itemListSchema(
            posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, name: p.title })),
          ),
        })}
      />
      <Header />
      <main className="container">
        <div className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Блог" }]} />
          <h1 className="title-large mt-6 md:mt-8">Блог Mute</h1>
          <p className="title-medium text-text-secondary mt-4">
            Про голосовое общение, игры и то, как созваниваться без лишних сложностей.
          </p>
          <h2 className="title-medium-semibold mt-10 md:mt-12">Все статьи</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                title={post.title}
                description={post.description}
                date={post.updated ?? post.date}
                image={post.image}
              />
            ))}
          </div>
          <p className="body-text text-text-secondary mt-8 md:mt-10">
            Новые статьи и гайды можно читать через RSS:{" "}
            <a href="/blog/feed.xml" className="text-accent hover:underline">
              mute.ac/blog/feed.xml
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

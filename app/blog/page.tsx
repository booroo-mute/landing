import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PostCard from "@/components/PostCard";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Блог Mute — про голосовое общение и игры",
  description:
    "Статьи о голосовых чатах для игр: сравнения сервисов, инструкции и советы. Чем заменить Discord, как созваниваться в браузере и не только.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Header />
      <main className="container">
        <div className="pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Блог" }]} />
          <h1 className="title-large mt-6 md:mt-8">Блог Mute</h1>
          <p className="title-medium text-text-secondary mt-4">
            Про голосовое общение, игры и то, как созваниваться без лишних сложностей.
          </p>
          <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
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
        </div>
      </main>
      <Footer />
    </>
  );
}

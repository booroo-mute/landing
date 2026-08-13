import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getAllBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/releases";

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
        <div className="max-w-[920px] mx-auto pt-10 md:pt-14 lg:pt-[72px] pb-12 md:pb-16 lg:pb-[80px]">
          <Breadcrumbs items={[{ label: "Блог" }]} />
          <h1 className="title-large mt-6 md:mt-8">Блог Mute</h1>
          <p className="title-medium text-text-secondary mt-4">
            Про голосовое общение, игры и то, как созваниваться без лишних сложностей.
          </p>
          <div className="mt-8 md:mt-10 flex flex-col gap-4 md:gap-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="w-full border border-[#1F1F1F] p-4 md:p-5 lg:p-6 transition-colors hover:bg-white/5"
              >
                <p className="body-text text-text-secondary">{formatDate(post.date)}</p>
                <h2 className="title-medium-semibold mt-2">{post.title}</h2>
                <p className="body-text text-text-secondary mt-2">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

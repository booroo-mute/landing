import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/releases";
import { OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Mute — блог о голосовом общении и играх";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  return renderOgImage({
    title: post?.title ?? "Блог Mute",
    kicker: "Блог Mute",
    date: post ? formatDate(post.updated ?? post.date) : undefined,
  });
}

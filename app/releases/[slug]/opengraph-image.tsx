import { getAllReleaseSlugs, getReleaseBySlug } from "@/lib/releases";
import { formatDate } from "@/lib/releases";
import { OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "Mute — что нового в приложении";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllReleaseSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);
  return renderOgImage({
    title: release?.title ?? "Что нового в Mute",
    kicker: release?.version ? `Что нового · Mute ${release.version}` : "Что нового в Mute",
    date: release ? formatDate(release.date) : undefined,
  });
}

import Link from "next/link";
import { formatDate } from "@/lib/releases";

interface ReleaseCardProps {
  slug: string;
  date: string;
  title: string;
  summary: string;
}

export default function ReleaseCard({ slug, date, title, summary }: ReleaseCardProps) {
  return (
    <Link
      href={`/releases/${slug}`}
      className="w-1/3 border border-[#1F1F1F] p-6 transition-colors hover:bg-white/5"
    >
      <p className="body-text text-text-secondary">{formatDate(date)}</p>
      <div className="mt-4">
        <h3 className="title-medium-semibold">{title}</h3>
        <p className="body-text text-text-secondary mt-2">{summary}</p>
      </div>
    </Link>
  );
}

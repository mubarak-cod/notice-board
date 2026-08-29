import Link from "next/link";
import { THEME } from "@/lib/Theme";

interface NoticeCardProps {
  slug: string;
  title: string;
  bodySnippet: string;
  categoryName?: string | null;
  date: string;
  attachmentUrl?: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function NoticeCard({ slug, title, bodySnippet, categoryName, date, attachmentUrl }: NoticeCardProps) {
  return (
    <Link
      href={`/notices/${slug}`}
      className="flex flex-col gap-3 rounded-2xl border p-5 transition-shadow hover:shadow-md"
      style={{ borderColor: "#E7E4DC", background: "#FFFFFF" }}
    >
      {attachmentUrl && (
        <img src={attachmentUrl} alt="" className="h-36 w-full rounded-lg object-cover" />
      )}
      <div className="flex items-center justify-between">
        {categoryName && (
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
            style={{ background: "rgba(255,141,39,0.14)", color: THEME.accent }}
          >
            {categoryName}
          </span>
        )}
        <span className="text-[12px]" style={{ color: "#9a9890" }}>{formatDate(date)}</span>
      </div>
      <h3 className="text-[16px] font-bold leading-snug" style={{ color: THEME.primary }}>
        {title}
      </h3>
      <p className="text-[13.5px] leading-relaxed" style={{ color: "#5B5F73", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {bodySnippet}
      </p>
      <span className="text-[12.5px] font-bold uppercase tracking-wide" style={{ color: THEME.accent }}>
        Read more →
      </span>
    </Link>
  );
}
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { THEME } from "@/lib/Theme";

export const dynamic = "force-dynamic";

interface NoticeDetailPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: notice } = await supabase
    .from("notices")
    .select("title, body, attachment_url, created_at, status, expires_at, categories(name)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!notice) notFound();

  const category = (notice.categories as unknown as { name: string } | null)?.name;

  return (
    <div style={{ background: "#FAFAF7" }} className="min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Link href="/notices" className="text-[13px] font-medium" style={{ color: THEME.primary }}>
          ← All notices
        </Link>

        <div className="mt-5 flex items-center justify-between">
          {category && (
            <span
              className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
              style={{ background: "rgba(255,141,39,0.14)", color: THEME.accent }}
            >
              {category}
            </span>
          )}
          <span className="text-[12.5px]" style={{ color: "#9a9890" }}>
            {formatDate(notice.created_at)}
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-extrabold leading-snug sm:text-3xl" style={{ color: THEME.primary }}>
          {notice.title}
        </h1>

        {notice.attachment_url && (
          <img
            src={notice.attachment_url}
            alt=""
            className="mt-6 w-full rounded-2xl border object-cover"
            style={{ borderColor: "#E7E4DC", maxHeight: 400 }}
          />
        )}

        <div
          className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed"
          style={{ color: "#1F2430" }}
        >
          {notice.body}
        </div>
      </div>
    </div>
  );
}
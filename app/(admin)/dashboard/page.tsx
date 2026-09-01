import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { THEME } from "@/lib/Theme";
import DashboardOverview, { type NoticeRow } from "@/components/admin/DashboardOverview";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: notices, error } = await supabase
    .from("notices")
    .select("id, slug, title, status, publish_at, expires_at, created_at, attachment_url, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF7" }}>
      <div className="border-b" style={{ background: THEME.primary, borderColor: THEME.primaryDark }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: THEME.muted }}>
              Department admin
            </p>
            <h1 className="mt-1 text-[20px] font-bold tracking-tight" style={{ color: THEME.onPrimary }}>
              Notices Dashboard
            </h1>
          </div>
          <Link
            href="/notices/new"
            className="rounded-md px-4 py-2 text-[13px] font-bold uppercase tracking-wide transition-all hover:opacity-90"
            style={{ background: THEME.accent, color: THEME.onPrimary }}
          >
            + New notice
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-4 text-[14px]" style={{ color: "#A32D2D" }}>
            Couldn&apos;t load notices: {error.message}
          </p>
        )}

        {!error && notices?.length === 0 && (
          <div className="rounded-2xl border py-16 text-center" style={{ borderColor: "#E7E4DC" }}>
            <p className="text-[14.5px]" style={{ color: "#5B5F73" }}>
              No notices yet. Click &quot;New notice&quot; to create the first one.
            </p>
          </div>
        )}

        {!error && notices && notices.length > 0 && <DashboardOverview notices={notices as NoticeRow[]} />}
      </div>
    </div>
  );
}
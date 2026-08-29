import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { THEME } from "@/lib/Theme";
import { deleteNotice } from "./actions";

interface NoticeRow {
  id: string;
  title: string;
  status: "draft" | "scheduled" | "published" | "archived";
  publish_at: string | null;
  expires_at: string | null;
  created_at: string;
  categories: { name: string } | null;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#EDEBE6", text: "#5B5F73" },
  scheduled: { bg: "rgba(255,141,39,0.14)", text: "#B8620E" },
  published: { bg: "rgba(47,111,94,0.14)", text: "#2F6F5E" },
  archived: { bg: "#EDEBE6", text: "#9a9890" },
};

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: notices, error } = await supabase
    .from("notices")
    .select("id, title, status, publish_at, expires_at, created_at, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF7" }}>
      <div className="border-b" style={{ background: THEME.primary, borderColor: THEME.primaryDark }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <h1 className="text-[18px] font-bold tracking-tight" style={{ color: THEME.onPrimary }}>
            Notices Dashboard
          </h1>
          <Link
            href="/notices/new"
            className="rounded-md px-4 py-2 text-[13.5px] font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
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

        {!error && notices && notices.length > 0 && (
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "#E7E4DC" }}>
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr style={{ background: "#F1EFE9" }}>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#5B5F73" }}>Title</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#5B5F73" }}>Category</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#5B5F73" }}>Status</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#5B5F73" }}>Publish date</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#5B5F73" }}>Expires</th>
                  <th className="px-4 py-3 font-semibold" style={{ color: "#5B5F73" }}></th>
                </tr>
              </thead>
              <tbody>
                {(notices as unknown as NoticeRow[]).map((notice, i) => {
                  const style = STATUS_STYLES[notice.status] ?? STATUS_STYLES.draft;
                  return (
                    <tr key={notice.id} style={{ borderTop: i === 0 ? "none" : "1px solid #E7E4DC" }}>
                      <td className="px-4 py-3 font-medium" style={{ color: "#1F2430" }}>{notice.title}</td>
                      <td className="px-4 py-3" style={{ color: "#5B5F73" }}>{notice.categories?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2.5 py-1 text-[12px] font-semibold capitalize" style={{ background: style.bg, color: style.text }}>
                          {notice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: "#5B5F73" }}>{formatDate(notice.publish_at)}</td>
                      <td className="px-4 py-3" style={{ color: "#5B5F73" }}>{formatDate(notice.expires_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-3">
                          {/* FIXED: was /admin/notices/.../edit — no /admin prefix in your real routes */}
                          <Link href={`/notices/${notice.id}/edit`} className="font-medium hover:opacity-70" style={{ color: THEME.primary }}>
                            Edit
                          </Link>
                          <form action={deleteNotice}>
                            <input type="hidden" name="id" value={notice.id} />
                            <button type="submit" className="font-medium hover:opacity-70" style={{ color: "#A32D2D" }}>
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
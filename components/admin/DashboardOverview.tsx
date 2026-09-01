"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { deleteNotice } from "@/app/(admin)/dashboard/actions";
import { THEME } from "@/lib/Theme";

export interface NoticeRow {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "scheduled" | "published" | "archived";
  publish_at: string | null;
  expires_at: string | null;
  created_at: string;
  attachment_url: string | null;
  categories: { name: string }[] | null;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#EDEBE6", text: "#5B5F73" },
  scheduled: { bg: "rgba(255,141,39,0.14)", text: "#B8620E" },
  published: { bg: "rgba(47,111,94,0.14)", text: "#2F6F5E" },
  archived: { bg: "#EDEBE6", text: "#9a9890" },
};

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function getStaggerDelay(index: number) {
  return Math.min(index * 0.06, 0.4);
}

export default function DashboardOverview({ notices }: { notices: NoticeRow[] }) {
  const publishedCount = notices.filter((notice) => notice.status === "published").length;
  const scheduledCount = notices.filter((notice) => notice.status === "scheduled").length;
  const draftCount = notices.filter((notice) => notice.status === "draft").length;
  const recentActivity = notices.slice(0, 5);

  const stats = [
    { label: "Published", value: String(publishedCount), accent: THEME.accent },
    { label: "Scheduled", value: String(scheduledCount), accent: "#8B5CF6" },
    { label: "Drafts", value: String(draftCount), accent: "#A5B4FC" },
    { label: "Total", value: String(notices.length), accent: "#2F6F5E" },
  ];

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: getStaggerDelay(index), ease: easeOutExpo }}
            className="rounded-2xl border p-4 shadow-[0_12px_30px_rgba(66,21,75,0.04)]"
            style={{ borderColor: "#E7E4DC", background: "#FFFFFF" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5B5F73" }}>
                  {stat.label}
                </p>
                <p className="mt-3 text-[28px] font-bold tracking-tight" style={{ color: "#1F2430" }}>
                  {stat.value}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl text-[12px] font-bold" style={{ background: `${stat.accent}1A`, color: stat.accent }}>
                {stat.label.slice(0, 1)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.12, ease: easeOutExpo }}
          className="overflow-hidden rounded-2xl border shadow-[0_12px_30px_rgba(66,21,75,0.04)]"
          style={{ borderColor: "#E7E4DC", background: "#FFFFFF" }}
        >
          <div className="border-b px-4 py-3" style={{ borderColor: "#E7E4DC", background: "#F5F2EE" }}>
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5B5F73" }}>
              Recent notices
            </h2>
          </div>

          <div className="hidden md:block">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr style={{ background: "#F5F2EE" }}>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5B5F73" }}>Title</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5B5F73" }}>Category</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5B5F73" }}>Status</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5B5F73" }}>Publish date</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5B5F73" }}>Expires</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5B5F73" }}></th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, i) => {
                  const style = STATUS_STYLES[notice.status] ?? STATUS_STYLES.draft;
                  return (
                    <motion.tr
                      key={notice.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(i * 0.045, 0.4), ease: easeOutExpo }}
                      className="transition-colors duration-150 hover:bg-[#FAF7F2]"
                      style={{ borderTop: i === 0 ? "none" : "1px solid #E7E4DC" }}
                    >
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-3">
                          {notice.attachment_url ? (
                            <img src={notice.attachment_url} alt="" className="h-10 w-10 rounded-lg border object-cover" style={{ borderColor: "#E7E4DC" }} />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border text-[10px] font-bold uppercase" style={{ borderColor: "#E7E4DC", background: "#F5F2EE", color: THEME.primary }}>
                              IMG
                            </div>
                          )}
                          <div>
                            <p className="text-[14px] font-semibold leading-snug" style={{ color: "#1F2430" }}>{notice.title}</p>
                            <p className="mt-0.5 text-[11px]" style={{ color: "#5B5F73" }}>Created {formatDate(notice.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 align-middle" style={{ color: "#5B5F73" }}>{notice.categories?.[0]?.name ?? "—"}</td>
                      <td className="px-4 py-3 align-middle">
                        <span className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize tracking-[0.04em]" style={{ background: style.bg, color: style.text }}>
                          {notice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle" style={{ color: "#5B5F73" }}>{formatDate(notice.publish_at)}</td>
                      <td className="px-4 py-3 align-middle" style={{ color: "#5B5F73" }}>{formatDate(notice.expires_at)}</td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/notices/${notice.id}/edit`} className="text-[13px] font-medium hover:opacity-70" style={{ color: THEME.primary }}>
                            Edit
                          </Link>
                          <form action={deleteNotice} className="inline-flex">
                            <input type="hidden" name="id" value={notice.id} />
                            <button type="submit" className="text-[13px] font-medium hover:opacity-70" style={{ color: "#A32D2D" }}>
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {notices.map((notice, index) => {
              const style = STATUS_STYLES[notice.status] ?? STATUS_STYLES.draft;
              return (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.4), ease: easeOutExpo }}
                  className="rounded-2xl border p-4"
                  style={{ borderColor: "#E7E4DC", background: "#FFFFFF" }}
                >
                  <div className="flex items-start gap-3">
                    {notice.attachment_url ? (
                      <img src={notice.attachment_url} alt="" className="h-14 w-14 rounded-xl border object-cover" style={{ borderColor: "#E7E4DC" }} />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl border text-[10px] font-bold uppercase" style={{ borderColor: "#E7E4DC", background: "#F5F2EE", color: THEME.primary }}>
                        IMG
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[15px] font-semibold leading-snug" style={{ color: "#1F2430" }}>{notice.title}</p>
                        <span className="inline-flex rounded-full px-2 py-1 text-[10px] font-semibold capitalize" style={{ background: style.bg, color: style.text }}>
                          {notice.status}
                        </span>
                      </div>

                      <p className="mt-2 text-[12px]" style={{ color: "#5B5F73" }}>{notice.categories?.[0]?.name ?? "Uncategorised"}</p>

                      <div className="mt-3 space-y-1 text-[12px]" style={{ color: "#5B5F73" }}>
                        <p><span className="font-medium" style={{ color: "#1F2430" }}>Publish:</span> {formatDate(notice.publish_at)}</p>
                        <p><span className="font-medium" style={{ color: "#1F2430" }}>Expires:</span> {formatDate(notice.expires_at)}</p>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <Link href={`/notices/${notice.id}/edit`} className="rounded-md px-3 py-2 text-[12px] font-semibold" style={{ background: "rgba(66,21,75,0.08)", color: THEME.primary }}>
                          Edit
                        </Link>
                        <form action={deleteNotice} className="inline-flex">
                          <input type="hidden" name="id" value={notice.id} />
                          <button type="submit" className="rounded-md px-3 py-2 text-[12px] font-semibold" style={{ background: "rgba(163,45,45,0.08)", color: "#A32D2D" }}>
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.16, ease: easeOutExpo }}
          className="rounded-2xl border p-4 shadow-[0_12px_30px_rgba(66,21,75,0.04)]"
          style={{ borderColor: "#E7E4DC", background: "#FFFFFF" }}
        >
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#5B5F73" }}>
            Recent activity
          </h2>

          <ul className="mt-4 space-y-3">
            {recentActivity.map((notice, index) => (
              <motion.li
                key={notice.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.05, 0.25), ease: easeOutExpo }}
                className="rounded-xl border p-3"
                style={{ borderColor: "#E7E4DC", background: "#FAF8F4" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold" style={{ color: "#1F2430" }}>{notice.title}</p>
                  <span className="inline-flex rounded-full px-2 py-1 text-[10px] font-semibold capitalize" style={{ background: STATUS_STYLES[notice.status].bg, color: STATUS_STYLES[notice.status].text }}>
                    {notice.status}
                  </span>
                </div>
                <p className="mt-2 text-[11px]" style={{ color: "#5B5F73" }}>Updated {formatDate(notice.created_at)}</p>
              </motion.li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </>
  );
}

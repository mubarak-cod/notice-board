"use client";

import { useState } from "react";
import NoticeCard from "./NoticeCard";
import { THEME } from "@/lib/Theme";

interface NoticeRow {
  slug: string;
  title: string;
  body: string;
  attachment_url: string | null;
  created_at: string;
  expires_at: string | null;
  categories: { name: string } | null;
}

function snippet(body: string, length = 120) {
  const trimmed = body.trim();
  return trimmed.length > length ? trimmed.slice(0, length) + "..." : trimmed;
}

const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2.5 3.5h11M4.5 8h7M6.5 12.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export default function NoticeCategoryFilter({ notices }: { notices: NoticeRow[] }) {
  const [category, setCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(notices.map((notice) => notice.categories?.name).filter(Boolean) as string[]))];
  const filteredNotices = category === "All"
    ? notices
    : notices.filter((notice) => notice.categories?.name === category);

  return (
    <>
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1" aria-label="Filter notices by category">
        <span className="mr-1 flex shrink-0 items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: THEME.primary }}>
          <FilterIcon /> Filter
        </span>
        {categories.map((item) => {
          const selected = item === category;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className="shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-transform hover:-translate-y-0.5"
              style={{
                color: selected ? THEME.onPrimary : THEME.primary,
                borderColor: selected ? THEME.accent : "rgba(66,21,75,0.14)",
                background: selected ? `linear-gradient(135deg, ${THEME.primary}, ${THEME.primaryDark})` : "linear-gradient(135deg, #FFFFFF, #FFF8F0)",
                boxShadow: selected ? "0 7px 16px rgba(66,21,75,0.16)" : "0 4px 12px rgba(66,21,75,0.05)",
              }}
            >
              {item}
            </button>
          );
        })}
      </div>

      {filteredNotices.length === 0 && (
        <div className="mt-8 rounded-2xl border py-14 text-center" style={{ borderColor: "#E7E4DC", background: "linear-gradient(145deg, #FFFFFF, #FFF8F0)" }}>
          <p className="text-[14px]" style={{ color: "#5B5F73" }}>No notices in this category yet.</p>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredNotices.map((notice) => (
          <NoticeCard
            key={notice.slug}
            slug={notice.slug}
            title={notice.title}
            bodySnippet={snippet(notice.body)}
            categoryName={notice.categories?.name}
            date={notice.created_at}
            attachmentUrl={notice.attachment_url}
            expiresAt={notice.expires_at}
          />
        ))}
      </div>
    </>
  );
}
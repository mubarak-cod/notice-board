"use client";

import NoticeCard from "./NoticeCard";
import { NOTICES } from "@/lib/Notices";
import { THEME } from "@/lib/Theme";

export default function Notices() {
  return (
    <section id="notices" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2
            className="text-3xl sm:text-[34px] font-extrabold"
            style={{ color: THEME.primary }}
          >
            Latest Notices
          </h2>
          <p className="mt-2 max-w-md text-[15px] text-gray-600">
            Everything posted by the department, most recent first.
          </p>
        </div>
        <a
          href="/notices"
          className="text-[14px] font-bold uppercase tracking-wide transition-opacity hover:opacity-80"
          style={{ color: THEME.accent }}
        >
          View all notices →
        </a>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {NOTICES.map((notice, index) => (
          <NoticeCard key={notice.id} notice={notice} index={index} />
        ))}
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { THEME } from "@/lib/Theme";
import type { Notice } from "@/lib/Notices";

interface NoticeCardProps {
  notice: Notice;
  index: number;
}

export default function NoticeCard({ notice, index }: NoticeCardProps) {
  return (
    <motion.a
      href={`#notice-${notice.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group flex flex-col rounded-lg border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      style={{ borderColor: "#E7E4DC" }}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
          style={{ background: `${THEME.accent}1A`, color: THEME.accent }}
        >
          {notice.category}
        </span>
        <span className="text-[12px] font-medium" style={{ color: "#8B8794" }}>
          {notice.date}
        </span>
      </div>

      <h3
        className="mt-3 text-[16.5px] font-bold leading-snug transition-colors group-hover:opacity-80"
        style={{ color: THEME.primary }}
      >
        {notice.title}
      </h3>

      <p className="mt-2 text-[13.5px] leading-relaxed text-gray-600 line-clamp-3">
        {notice.excerpt}
      </p>

      <span
        className="mt-4 text-[13px] font-bold uppercase tracking-wide"
        style={{ color: THEME.accent }}
      >
        Read more →
      </span>
    </motion.a>
  );
}
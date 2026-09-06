"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { THEME } from "@/lib/Theme";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

function formatRemaining(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default function NoticeCountdown({ expiresAt }: { expiresAt: string | null | undefined }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!expiresAt) return;

    const expiry = new Date(expiresAt).getTime();
    const update = () => setRemaining(expiry - Date.now());
    update();

    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  if (remaining === null || remaining <= 0) return null;

  const urgent = remaining < 24 * 60 * 60 * 1000;
  const content = (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
      style={{
        color: urgent ? THEME.accent : THEME.primary,
        borderColor: urgent ? "rgba(255,141,39,0.35)" : "rgba(66,21,75,0.14)",
        background: urgent ? "linear-gradient(135deg, rgba(255,141,39,0.17), rgba(255,177,92,0.08))" : "linear-gradient(135deg, rgba(66,21,75,0.08), rgba(255,255,255,0.7))",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5.7" stroke="currentColor" strokeWidth="1.25" />
        <path d="M8 4.7V8l2.1 1.3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Closes in {formatRemaining(remaining)}
    </span>
  );

  return urgent ? (
    <motion.span animate={{ opacity: [1, 0.58, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: easeOutExpo }}>
      {content}
    </motion.span>
  ) : content;
}
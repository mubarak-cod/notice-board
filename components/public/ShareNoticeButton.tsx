"use client";

import { useState } from "react";
import { THEME } from "@/lib/Theme";

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="12.5" cy="3.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="3.5" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="12.5" cy="12.5" r="1.8" stroke="currentColor" strokeWidth="1.2" />
    <path d="m5.1 7.2 5.8-2.9M5.1 8.8l5.8 2.9" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export default function ShareNoticeButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function shareNotice() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={shareNotice}
      className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5"
      style={{ color: THEME.primary, borderColor: "rgba(66,21,75,0.15)", background: "linear-gradient(135deg, #FFFFFF, #FFF7ED)", boxShadow: "0 7px 18px rgba(66,21,75,0.07)" }}
    >
      <ShareIcon />
      {copied ? "Link copied" : "Share notice"}
    </button>
  );
}
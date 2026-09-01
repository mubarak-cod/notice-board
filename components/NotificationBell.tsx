"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { THEME } from "@/lib/Theme";

interface NoticeAlert {
  id: string;
  title: string;
  slug: string;
  created_at: string;
}

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export default function NotificationBell() {
  const [notices, setNotices] = useState<NoticeAlert[]>([]);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("public-notices-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notices" },
        (payload) => {
          const row = payload.new as { id: string; title: string; slug: string; status: string; created_at: string };
          if (row.status === "published") {
            setNotices((prev) => [{ id: row.id, title: row.title, slug: row.slug, created_at: row.created_at }, ...prev].slice(0, 10));
            setSeen(false);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notices" },
        (payload) => {
          const row = payload.new as { id: string; title: string; slug: string; status: string; created_at: string };
          if (row.status === "published") {
            setNotices((prev) => {
              if (prev.find((n) => n.id === row.id)) return prev;
              return [{ id: row.id, title: row.title, slug: row.slug, created_at: row.created_at }, ...prev].slice(0, 10);
            });
            setSeen(false);
          }
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        onClick={() => { setOpen((v) => !v); setSeen(true); }}
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        style={{ color: THEME.onPrimary }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2.5c-2.4 0-4.2 1.9-4.2 4.3v2.4c0 .6-.3 1.5-.7 2l-.9 1.1c-.6.8-.2 2 .8 2.2 2.9.6 6 .6 8.9 0 .9-.2 1.4-1.4.8-2.2l-.9-1.1c-.4-.5-.7-1.4-.7-2V6.8c0-2.4-1.9-4.3-4.2-4.3-.1 0 0 0 0 0Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8.1 16.7a1.9 1.9 0 0 0 3.7 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          {!seen && notices.length > 0 && (
            <circle cx="14.8" cy="4.6" r="2.6" fill={THEME.accent} stroke={THEME.primary} strokeWidth="1.5" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: easeOutExpo }}
            className="absolute right-0 top-12 z-50 w-72 rounded-xl border py-2 shadow-lg"
            style={{ originX: 1, originY: 0, background: "#FFFFFF", borderColor: "#E7E4DC" }}
          >
            <p className="px-3.5 pb-2 text-[12px] font-semibold uppercase tracking-wide" style={{ color: "#5B5F73" }}>
              Recent notices
            </p>
            {notices.length === 0 && (
              <p className="px-3.5 py-3 text-[13px]" style={{ color: "#5B5F73" }}>No new notices yet.</p>
            )}
            {notices.map((n) => (
              <Link
                key={n.id}
                href={`/notices/${n.slug}`}
                onClick={() => setOpen(false)}
                className="block px-3.5 py-2.5 text-[13.5px] hover:bg-black/3"
                style={{ color: "#1F2430" }}
              >
                {n.title}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
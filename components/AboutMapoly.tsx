"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { THEME, SCHOOL_NAME, DEPARTMENT_NAME } from "@/lib/Theme";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="m6 3.5 10.5 10.5M12.7 4.2l3.1 3.1M5.2 14.8 3.5 16.5M6.3 7.1l6.6 6.6M4.8 10.8l4.4-4.4 2.2.5 2.6-2.6 2.7 2.7-2.6 2.6.5 2.2-4.4 4.4-5.4-5.4Z" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SignalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="15.5" r="1.2" fill="currentColor" />
    <path d="M6.7 12.3a4.7 4.7 0 0 1 6.6 0M4.2 9.8a8.2 8.2 0 0 1 11.6 0M1.8 7.3a11.6 11.6 0 0 1 16.4 0" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AboutMapoly() {
  return (
    <section className="relative overflow-hidden border-y" style={{ background: `linear-gradient(135deg, ${THEME.primaryDark} 0%, ${THEME.primary} 58%, #54205D 100%)`, borderColor: "rgba(255,255,255,0.1)" }}>
      <div className="pointer-events-none absolute -right-24 top-12 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: THEME.accent }} />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1fr_0.92fr] md:items-center md:gap-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: easeOutExpo }}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: THEME.accent }}>
            About {SCHOOL_NAME}
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl" style={{ color: THEME.onPrimary }}>
            The notice board, finally in the right place.
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed" style={{ color: THEME.muted }}>
            {SCHOOL_NAME} is a polytechnic community in motion. This board gives {DEPARTMENT_NAME} one reliable signal for exam dates, events, workshops, and the small announcements that used to disappear into a crowded pin-board or a noisy WhatsApp group.
          </p>
          <Link
            href="#subscribe"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-4 py-3 text-[13px] font-bold uppercase tracking-wide transition-transform hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${THEME.accent}, #FFB15C)`, color: THEME.primaryDark, boxShadow: "0 12px 28px rgba(255,141,39,0.24)" }}
          >
            Stay tuned <ArrowIcon />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28, rotate: 2 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay: 0.08, ease: easeOutExpo }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -inset-3 rounded-[28px] opacity-40 blur-xl" style={{ background: `linear-gradient(135deg, ${THEME.accent}, transparent 65%)` }} />
          <div className="relative rounded-3xl border p-4 shadow-[0_24px_70px_rgba(20,5,28,0.34)]" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))", borderColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(12px)" }}>
            <div className="rounded-[18px] border p-5" style={{ background: `linear-gradient(160deg, ${THEME.primary} 0%, rgba(51,16,58,0.72) 100%)`, borderColor: "rgba(255,255,255,0.1)" }}>
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: THEME.muted }}>One clear signal</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "rgba(255,141,39,0.16)", color: THEME.accent }}><SignalIcon /></span>
              </div>
              <div className="relative mt-5 space-y-3 pl-5">
                <div className="absolute bottom-3 left-1.75 top-3 w-px" style={{ background: `linear-gradient(${THEME.accent}, rgba(255,255,255,0.12))` }} />
                {[
                  ["Old pin-board", "Easy to miss", "rgba(255,255,255,0.5)"],
                  ["WhatsApp groups", "Buried in noise", "rgba(255,255,255,0.5)"],
                  ["MAPOLY board", "Published. Searchable. Yours.", THEME.accent],
                ].map(([label, detail, color], index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.22 + index * 0.1, ease: easeOutExpo }}
                    className="relative rounded-xl border px-3.5 py-3"
                    style={{ background: index === 2 ? "rgba(255,141,39,0.1)" : "rgba(255,255,255,0.045)", borderColor: index === 2 ? "rgba(255,141,39,0.35)" : "rgba(255,255,255,0.08)" }}
                  >
                    <span className="absolute -left-6 top-4 h-3 w-3 rounded-full border-2" style={{ background: THEME.primary, borderColor: color }} />
                    <p className="flex items-center gap-2 text-[13px] font-bold" style={{ color: index === 2 ? THEME.onPrimary : "rgba(255,255,255,0.8)" }}>
                      {index === 0 && <PinIcon />}{label}
                    </p>
                    <p className="mt-1 text-[12px]" style={{ color: index === 2 ? THEME.accent : THEME.muted }}>{detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
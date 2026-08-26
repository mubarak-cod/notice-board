"use client";

import { THEME } from "@/lib/Theme";

export default function HeroContent() {
  return (
    <div className="relative z-10 max-w-xl">
      <p
        className="mb-3 text-[13px] font-bold uppercase tracking-widest"
        style={{ color: THEME.accent }}
      >
        MAPOLY · Computer Science Department
      </p>

      <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-white">
        Every Notice, In One Place.
      </h1>

      <p className="mt-5 text-[15.5px] sm:text-base leading-relaxed text-white/85">
        No more missing an announcement because you weren&apos;t at the board in
        time. Browse, search, and get notified the moment something new goes
        up — from exam schedules to department news.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <a
          href="#notices"
          className="inline-flex items-center rounded-md px-6 py-3 text-[14.5px] font-bold uppercase tracking-wide transition-opacity hover:opacity-90"
          style={{ background: THEME.accent, color: THEME.onPrimary }}
        >
          View Notices
        </a>
        <a
          href="#about"
          className="inline-flex items-center rounded-md border px-6 py-3 text-[14.5px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          style={{ borderColor: "rgba(255,255,255,0.5)" }}
        >
          Learn More
        </a>
      </div>
    </div>
  );
}
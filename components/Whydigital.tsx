"use client";

import ComparisonRow from "./Comparisonrow";
import { COMPARISONS } from "@/lib/Comparisons";
import { THEME } from "@/lib/Theme";

export default function WhyDigital() {
  return (
    <section id="why" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <h2
        className="text-3xl sm:text-[34px] font-extrabold"
        style={{ color: THEME.primary }}
      >
        Why This Beats the Board
      </h2>
      <p className="mt-2 max-w-md text-[15px] text-gray-600">
        Same purpose, none of the friction.
      </p>

      {/* Column headers — desktop only, mobile gets inline labels per row */}
      <div
        className="mt-10 hidden border-b pb-3 sm:grid sm:grid-cols-[140px_1fr_1fr] sm:gap-6"
        style={{ borderColor: "#E7E4DC" }}
      >
        <span />
        <span className="text-[12px] font-bold uppercase tracking-wide text-gray-400">
          The Physical Board
        </span>
        <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: THEME.accent }}>
          This Site
        </span>
      </div>

      <div className="mt-2">
        {COMPARISONS.map((point, index) => (
          <ComparisonRow key={point.id} point={point} index={index} />
        ))}
      </div>
    </section>
  );
}
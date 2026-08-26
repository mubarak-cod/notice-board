"use client";

import { motion } from "framer-motion";
import { THEME } from "@/lib/Theme";
import type { ComparisonPoint } from "@/lib/Comparisons"

interface ComparisonRowProps {
  point: ComparisonPoint;
  index: number;
}

export default function ComparisonRow({ point, index }: ComparisonRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="grid grid-cols-1 gap-3 border-b py-5 sm:grid-cols-[140px_1fr_1fr] sm:items-center sm:gap-6"
      style={{ borderColor: "#E7E4DC" }}
    >
      <span className="text-[12px] font-bold uppercase tracking-wide text-gray-400">
        {point.label}
      </span>

      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 text-[15px] leading-none text-gray-300">✕</span>
        <p className="text-[14.5px] leading-relaxed text-gray-500">
          <span className="mr-1.5 text-[10px] font-bold uppercase text-gray-400 sm:hidden">
            Old way:
          </span>
          {point.before}
        </p>
      </div>

      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 text-[15px] leading-none" style={{ color: THEME.accent }}>
          ✓
        </span>
        <p className="text-[14.5px] font-medium leading-relaxed" style={{ color: THEME.primary }}>
          <span className="mr-1.5 text-[10px] font-bold uppercase sm:hidden" style={{ color: THEME.accent }}>
            Now:
          </span>
          {point.after}
        </p>
      </div>
    </motion.div>
  );
}
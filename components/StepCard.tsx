"use client";

import { motion } from "framer-motion";
import { THEME } from "@/lib/Theme";
import type { Step } from "@/lib/Steps";

interface StepCardProps {
  step: Step;
  index: number;
}

export default function StepCard({ step, index }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
    >
      <span
        className="text-[42px] font-extrabold leading-none"
        style={{ color: `${THEME.accent}33` }}
      >
        {step.number}
      </span>
      <h3 className="mt-3 text-[19px] font-bold" style={{ color: THEME.primary }}>
        {step.title}
      </h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-gray-600">
        {step.description}
      </p>
    </motion.div>
  );
}
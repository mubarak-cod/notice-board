"use client";

import StepCard from "./StepCard";
import { STEPS } from "@/lib/Steps";
import { THEME } from "@/lib/Theme";

export default function HowItWorks() {
  return (
    <section id="about" className="bg-[#FAF8F5] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2
          className="text-3xl sm:text-[34px] font-extrabold"
          style={{ color: THEME.primary }}
        >
          How It Works
        </h2>
        <p className="mt-2 max-w-md text-[15px] text-gray-600">
          Three steps between you and never missing a notice again.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-gray-200">
          {STEPS.map((step, index) => (
            <div key={step.id} className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
              <StepCard step={step} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import dynamic from "next/dynamic";
import HeroBackground from "./Herobackground";
import HeroContent from "./Herocontent";

// Loaded client-side only — the Lottie player touches the canvas, which
// breaks server rendering if it's imported the normal way.
const Herolottie = dynamic(
  () => import("./HeroBottie").then((mod) => mod.default),
  { ssr: false }
);

export default function HeroBottie() {
  return (
    <section className="relative flex min-h-[600px] items-center overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col-reverse items-center justify-between gap-10 px-4 py-20 sm:px-6 md:flex-row">
        <HeroContent />
        <Herolottie />
      </div>
    </section>
  );
}
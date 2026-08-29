"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export default function HeroLottie() {
  return (
    <div className="relative z-10 hidden md:block w-full max-w-md">
      <DotLottieReact
        src="/animations/notification.lottie" 
        loop
        autoplay
      />
    </div>
  );
}
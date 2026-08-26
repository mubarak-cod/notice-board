"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { THEME } from "@/lib/Theme";

/*
 * Drop your own images into /public/hero/ and update the paths + alt text
 * below. Keep three (or however many you want) — they'll cycle in order.
 */
const HERO_IMAGES = [
  { src: "https://res.cloudinary.com/ddlnqthao/image/upload/v1787637389/05c859c1-1677-4e42-bcc9-5e96452ce618.png", alt: "Students on campus" }, // TODO: swap for your own
  { src: "https://res.cloudinary.com/ddlnqthao/image/upload/v1787637454/22d63d97-e41e-4c18-a77e-d1c70d564141.png", alt: "MAPOLY school building" }, // TODO: swap for your own
  { src: "https://res.cloudinary.com/ddlnqthao/image/upload/v1787637541/7a7c38b0-35de-435a-8624-203b14cc5793.png", alt: "Notice board in use" }, // TODO: swap for your own
];

const SLIDE_DURATION_MS = 5000;

export default function HeroBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={HERO_IMAGES[index].src}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Image
            src={HERO_IMAGES[index].src}
            alt={HERO_IMAGES[index].alt}
            fill
            priority={index === 0}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay — brand purple, stronger on the left where the text sits */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${THEME.primary}E6 0%, ${THEME.primary}B3 45%, ${THEME.primary}66 100%)`,
        }}
      />
    </div>
  );
}
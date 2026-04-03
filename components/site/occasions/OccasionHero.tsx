"use client";

import { motion } from "framer-motion";
import type { OccasionData } from "@/lib/data/occasions";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

export default function OccasionHero({ occasion }: { occasion: OccasionData }) {
  return (
    <section className="relative min-h-[60vh] overflow-hidden" style={{ backgroundColor: occasion.colorBg }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col justify-center p-8 lg:p-16 relative z-10"
        >
          <p className="font-body text-[10px] text-white/60 uppercase tracking-[0.2em] mb-4">
            Occasion
          </p>
          <h1 className="font-heading text-5xl lg:text-7xl text-white leading-[1.05]">
            {occasion.name}
          </h1>
          <p className="font-heading text-2xl text-white/80 italic mt-4">
            {occasion.tagline}
          </p>
          <p className="font-body text-base text-white/70 leading-[1.8] mt-6 max-w-md">
            {occasion.description}
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-10 text-white/50 text-2xl"
          >
            ↓
          </motion.div>
        </motion.div>

        {/* Right — image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative min-h-[300px] lg:min-h-0"
          style={{ clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)" }}
        >
          <ImagePlaceholder
            aspectRatio=""
            label={occasion.name}
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  light = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      {eyebrow && (
        <p
          className={`font-body text-[10px] font-medium uppercase tracking-[0.2em] mb-3 ${
            light ? "text-gold" : "text-gold"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-heading text-4xl md:text-[42px] font-semibold leading-tight ${
          light ? "text-white" : "text-brown-deep"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`font-body text-[15px] mt-4 max-w-xl leading-relaxed ${
            centered ? "mx-auto" : ""
          } ${light ? "text-white/70" : "text-brown-mid"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

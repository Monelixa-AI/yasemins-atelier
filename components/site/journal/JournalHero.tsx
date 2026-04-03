"use client";

import { motion } from "framer-motion";

interface JournalHeroProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function JournalHero({
  categories,
  activeCategory,
  onCategoryChange,
}: JournalHeroProps) {
  return (
    <section className="bg-brown-deep py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-px bg-gold mx-auto mb-8" />

          <h1 className="font-heading text-5xl lg:text-7xl text-white italic">
            Atelier Journal
          </h1>

          <p className="font-body text-lg text-white/70 mt-6 max-w-lg mx-auto leading-relaxed">
            Gastronomi notları, mevsim hikayeleri,
            <br className="hidden sm:block" />
            sofra rehberleri ve mutfak sırları.
          </p>
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mt-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`font-body text-xs px-4 py-2 rounded-none transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-terracotta text-white"
                  : "border border-gold/40 text-white/60 hover:border-gold hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

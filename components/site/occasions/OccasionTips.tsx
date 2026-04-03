"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/site/ui/SectionHeader";

export default function OccasionTips({ tips }: { tips: string[] }) {
  if (tips.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow="Tavsiyeler" title="Yasemin'in Tavsiyeleri" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-cream border-l-4 border-terracotta p-6"
            >
              <span className="text-xl mb-2 block">💡</span>
              <p className="font-heading text-lg italic text-brown-deep leading-relaxed">
                {tip}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

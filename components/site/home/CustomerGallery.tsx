"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/site/ui/SectionHeader";
import { Heart } from "lucide-react";

const likeCounts = [234, 187, 312, 156, 278, 91, 205, 143, 267, 119, 198, 302];

const galleryItems = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  likes: likeCounts[i],
  tall: i % 5 === 0 || i % 5 === 3,
}));

const gradients = [
  "from-terracotta/30 to-gold/20",
  "from-gold/30 to-cream",
  "from-brown-deep/20 to-terracotta/20",
  "from-terracotta-light to-cream",
  "from-gold-light to-gold/20",
  "from-brown-mid/20 to-cream",
];

export default function CustomerGallery() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Sosyal"
          title="#YaseminSofrasında"
          subtitle="Müşterilerimizin sofralarından"
        />

        {/* Masonry grid */}
        <div className="columns-2 lg:columns-4 gap-4 space-y-4">
          {galleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              className="break-inside-avoid group relative overflow-hidden"
            >
              <div
                className={`bg-gradient-to-br ${
                  gradients[i % gradients.length]
                } ${item.tall ? "aspect-[3/4]" : "aspect-square"}`}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="flex items-center gap-2 text-white">
                  <Heart size={18} className="fill-white" />
                  <span className="font-body text-sm">{item.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

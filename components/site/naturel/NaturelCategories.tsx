"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/site/ui/SectionHeader";
import {
  naturelCategories,
  naturelProducts,
} from "@/lib/data/naturel-products";

export default function NaturelCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="KATEGOR\u0130LER"
          title="Her \u0130htiyaca Bir Lezzet"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {naturelCategories.map((cat, i) => {
            const count = naturelProducts.filter(
              (p) => p.categoryId === cat.id
            ).length;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
              >
                <Link
                  href={`/naturel/${cat.slug}`}
                  className="group block p-6 border border-gray-100 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                  style={{ backgroundColor: cat.colorBg || "#F9FAFB" }}
                >
                  <span className="text-3xl block mb-3">{cat.emoji}</span>
                  <h3 className="font-heading text-lg text-brown-deep font-semibold group-hover:text-[#4A7C3F] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-body text-[12px] text-brown-deep/60 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                  <p
                    className="font-body text-[11px] font-medium mt-3 uppercase tracking-wider"
                    style={{ color: "#4A7C3F" }}
                  >
                    {count} \u00FCr\u00FCn \u2192
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

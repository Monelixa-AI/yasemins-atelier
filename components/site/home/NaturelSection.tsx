"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const miniProducts = [
  { emoji: "🥣", name: "Ev Yapımı Granola", price: "120₺" },
  { emoji: "🍪", name: "Çocuk Krakerler", price: "90₺" },
  { emoji: "🥜", name: "Ballı Ceviz", price: "145₺" },
  { emoji: "🎁", name: "Naturel Kutu", price: "420₺" },
];

export default function NaturelSection() {
  return (
    <section className="py-20 overflow-hidden" style={{ backgroundColor: "#2D4A1E" }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-center">
          {/* Left — text + mini products */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#A8D5A2]" />
              <p className="font-body text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "#A8D5A2" }}>
                Yeni Koleksiyon
              </p>
            </div>

            <h2 className="font-heading text-4xl lg:text-[56px] text-white leading-tight">
              Atelier Naturel
            </h2>
            <p className="font-body text-base text-white/75 mt-4 max-w-md">
              El yapımı, katkısız, sağlıklı atıştırmalıklar. Granola, kuruyemiş, çocuk serisi ve doğal soslar.
            </p>

            {/* Mini product grid */}
            <div className="grid grid-cols-2 gap-3 mt-8">
              {miniProducts.map((p) => (
                <div key={p.name} className="bg-white/10 border border-white/20 p-3 flex items-center gap-3">
                  <span className="text-xl">{p.emoji}</span>
                  <div>
                    <p className="font-body text-[13px] text-white/90">{p.name}</p>
                    <p className="font-body text-xs" style={{ color: "#A8D5A2" }}>{p.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-8">
              <Link
                href="/naturel"
                className="inline-flex items-center font-body text-sm font-medium px-8 py-3 rounded-none transition-colors"
                style={{ backgroundColor: "#A8D5A2", color: "#2D4A1E" }}
              >
                Tüm Naturel Ürünler →
              </Link>
              <span className="font-body text-xs text-white/50">📦 Türkiye geneli kargo</span>
            </div>
          </motion.div>

          {/* Right — placeholder visual */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[3/4] bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="font-heading text-xl italic text-white/40">Naturel Koleksiyon</span>
            </div>
            <div className="absolute top-4 right-4 px-3 py-1.5" style={{ backgroundColor: "#A8D5A2", color: "#2D4A1E" }}>
              <span className="font-body text-[11px] font-bold">🌿 Katkısız</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

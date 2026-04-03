"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

const products = [
  "Mini Sebzeli Krakerler — Havuç, ıspanak, pancar",
  "Meyve Topları — Şekersiz, hurma bazlı",
  "Çocuk Patlamış Mısır — Hafif tuzlu veya ballı",
  "Meyveli Granola Bar — Pratik atıştırmalık",
];

export default function NaturelChildrenSection() {
  return (
    <section className="py-24" style={{ backgroundColor: "#2D4A1E" }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <ImagePlaceholder
              aspectRatio="aspect-[3/4]"
              label="Çocuk Serisi"
              className="w-full"
            />

            {/* Floating Badge */}
            <div
              className="absolute top-6 right-6 px-4 py-2.5 rounded-full shadow-lg font-body text-[13px] font-medium"
              style={{ backgroundColor: "#A8D5A2", color: "#2D4A1E" }}
            >
              \uD83D\uDC76 1 Yaş+ Güvenli
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            {/* Eyebrow */}
            <p
              className="font-body text-[10px] font-medium uppercase tracking-[0.2em] mb-3"
              style={{ color: "#A8D5A2" }}
            >
              ÇOCUK SERİSİ
            </p>

            {/* Heading */}
            <h2 className="font-heading text-[36px] md:text-[52px] font-semibold text-white leading-tight">
              Çocuğunuza güvenle verebileceğiniz lezzetler.
            </h2>

            {/* Paragraph */}
            <p className="font-body text-[15px] text-white/70 leading-relaxed mt-5 max-w-lg">
              Tüm çocuk serisi ürünlerimiz, katkı maddesi içermez, yapay
              şeker eklenmez ve pediatrist danışmanlığında
              geliştirilmiştir. Küçük paketlerde, küçük eller için.
            </p>

            {/* Product List */}
            <div className="mt-8 space-y-3">
              {products.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "#A8D5A2" }}
                  >
                    <Check size={12} style={{ color: "#2D4A1E" }} />
                  </div>
                  <span className="font-body text-[14px] text-white/90">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/naturel/cocuk-serisi"
              className="inline-flex items-center justify-center font-body text-sm font-semibold px-8 py-4 mt-10 transition-colors duration-300 hover:opacity-90"
              style={{ backgroundColor: "#A8D5A2", color: "#2D4A1E" }}
            >
              Çocuk Serisini Gör →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

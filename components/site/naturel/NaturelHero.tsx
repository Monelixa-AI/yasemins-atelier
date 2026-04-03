"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

const stats = [
  { value: "14+", label: "Ürün" },
  { value: "0", label: "Katkı Maddesi" },
  { value: "\uD83D\uDE9A", label: "Türkiye'ye Kargo" },
];

export default function NaturelHero() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2D4A1E 0%, #3D1A0A 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-0 lg:min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 w-full">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block font-body text-[11px] text-white px-4 py-2 rounded-full bg-white/10 border border-white/20">
                \uD83C\uDF3F 100% Katkısız · El Yapımı · Türkiye Geneli
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-6 font-heading text-[48px] sm:text-[64px] lg:text-[82px] font-semibold leading-[1.05]"
            >
              <span className="text-white italic">Doğadan Sofraya,</span>
              <br />
              <span style={{ color: "#A8D5A2" }}>Sevgiyle Hazırlanmış.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="font-body text-[17px] text-white/75 leading-[1.8] mt-5 max-w-lg"
            >
              Katkı maddesi içermeyen, el yapımı atıştırmalıklar.
              Granola, kurabiye, çocuk serisi ve doğal soslar.
              Yasemin&apos;in mutfağından, sofralarınıza.
            </motion.p>

            {/* Feature Icons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-6"
            >
              <span className="font-body text-[13px] text-white/70">
                \uD83C\uDF3F Katkı Maddesi Yok
              </span>
              <span className="text-white/30">|</span>
              <span className="font-body text-[13px] text-white/70">
                \uD83D\uDC76 Çocuklar İçin Güvenli
              </span>
              <span className="text-white/30">|</span>
              <span className="font-body text-[13px] text-white/70">
                \uD83D\uDCE6 Türkiye Geneli Kargo
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3 mt-8"
            >
              <Link
                href="/naturel/urunler"
                className="inline-flex items-center justify-center font-body text-sm font-medium tracking-wide text-white px-8 py-4 transition-colors duration-300 hover:opacity-90"
                style={{ backgroundColor: "#4A7C3F" }}
              >
                Ürünleri Keşfet →
              </Link>
              <Link
                href="/urunler/naturel-hediye-kutusu"
                className="inline-flex items-center justify-center font-body text-sm font-medium tracking-wide px-8 py-4 transition-colors duration-300 hover:bg-white/10"
                style={{ border: "1px solid #A8D5A2", color: "#A8D5A2" }}
              >
                Hediye Kutusu Al
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex items-center gap-0 mt-10 pt-6 border-t border-white/10"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center">
                  {i > 0 && (
                    <div className="w-px h-8 bg-white/15 mx-6 sm:mx-10" />
                  )}
                  <div>
                    <p
                      className="font-heading text-2xl font-bold"
                      style={{ color: "#A8D5A2" }}
                    >
                      {stat.value}
                    </p>
                    <p className="font-body text-[11px] text-white/50">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Collage */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative hidden lg:flex items-center"
          >
            <div className="relative w-full">
              {/* Main Image */}
              <div className="relative z-10 ml-8">
                <ImagePlaceholder
                  aspectRatio="aspect-[3/4]"
                  label="Naturel Ürünler"
                  className="w-full rounded-sm overflow-hidden"
                />
              </div>

              {/* Top-right smaller image */}
              <div className="absolute -top-8 -right-4 z-20 w-[45%]">
                <ImagePlaceholder
                  aspectRatio="aspect-square"
                  label="Granola"
                  className="w-full rounded-sm overflow-hidden shadow-2xl"
                />
              </div>

              {/* Bottom-left smaller image */}
              <div className="absolute -bottom-6 -left-4 z-20 w-[40%]">
                <ImagePlaceholder
                  aspectRatio="aspect-[4/3]"
                  label="Çocuk Serisi"
                  className="w-full rounded-sm overflow-hidden shadow-2xl"
                />
              </div>

              {/* Floating Badge */}
              <div
                className="absolute top-1/2 -left-2 z-30 px-4 py-2 rounded-full shadow-lg font-body text-[12px] font-medium text-white"
                style={{ backgroundColor: "#4A7C3F" }}
              >
                ✓ Yasemin Tarifi
              </div>
            </div>
          </motion.div>

          {/* Mobile Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="lg:hidden relative"
          >
            <ImagePlaceholder
              aspectRatio="aspect-[4/3]"
              label="Naturel Ürünler"
              className="w-full rounded-sm overflow-hidden"
            />
            <div
              className="absolute bottom-4 right-4 px-4 py-2 rounded-full shadow-lg font-body text-[12px] font-medium text-white"
              style={{ backgroundColor: "#4A7C3F" }}
            >
              ✓ Yasemin Tarifi
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Hand, Leaf, Clock } from "lucide-react";

const stats = [
  { value: "500+", label: "Mutlu Sofra" },
  { value: "40+", label: "Meze Çeşidi" },
  { value: "5★", label: "Ortalama Puan" },
];

const trustBadges = [
  { icon: Hand, label: "%100 El Yapımı" },
  { icon: Leaf, label: "Doğal & Katkısız" },
  { icon: Clock, label: "Her Gün Taze" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brown-deep">
      {/* ===== MOBILE: photo on top + content below ===== */}
      <div className="lg:hidden">
        {/* Mobile photo — dynamically positioned */}
        <div className="relative w-full" style={{ height: "clamp(260px, 42vh, 400px)" }}>
          <Image
            src="/images/hero-chef.png"
            alt="Yasemin — Gastronomi Şefi"
            fill
            className="object-cover"
            style={{ objectPosition: "60% 20%" }}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brown-deep via-brown-deep/10 to-transparent" />
        </div>

        {/* Mobile content */}
        <div className="px-5 pb-10 -mt-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-gold" />
            <p className="font-body text-[9px] text-gold font-medium uppercase tracking-[0.2em]">
              Gastronomi Atölyesi · İstanbul
            </p>
          </div>

          <h1 className="font-heading text-[38px] font-semibold text-white leading-[1.05]">
            Her Sofra,
            <br />
            Bir Sanat <span className="italic text-gold">Eseridir.</span>
          </h1>

          <p className="font-body text-sm text-white/70 leading-[1.7] mt-3">
            İstanbul&apos;un kalbinden, el emeğiyle hazırlanan lezzetler sofralarınıza taşınıyor.
          </p>

          <div className="flex flex-col gap-3 mt-5">
            <Link href="/menu" className="inline-flex items-center justify-center font-body text-sm font-medium bg-terracotta text-white px-6 py-3.5 rounded-none hover:bg-terracotta-dark transition-colors">
              Menüyü Keşfet →
            </Link>
            <Link href="/siparis" className="inline-flex items-center justify-center font-body text-sm font-medium border border-white/30 text-white px-6 py-3.5 rounded-none hover:bg-white/10 transition-colors">
              Sipariş Danışmanı
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-1.5">
                <badge.icon size={13} className="text-gold" strokeWidth={1.5} />
                <span className="font-body text-[10px] text-white/70">{badge.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-0 mt-6 pt-5 border-t border-white/10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                {i > 0 && <div className="w-px h-7 bg-white/15 mx-5" />}
                <div>
                  <p className="font-heading text-xl font-bold text-gold">{stat.value}</p>
                  <p className="font-body text-[10px] text-white/50">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== DESKTOP: full-screen with bg image ===== */}
      <div className="hidden lg:block relative h-[calc(100vh-90px)] min-h-[640px] max-h-[900px]">
        <Image
          src="/images/hero-chef.png"
          alt="Yasemin — Gastronomi Şefi"
          fill
          className="object-cover object-[center_15%]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brown-deep/90 via-brown-deep/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-deep/80 via-transparent to-brown-deep/20" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-8 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-gold" />
            <p className="font-body text-[10px] text-gold font-medium uppercase tracking-[0.2em]">Gastronomi Atölyesi · İstanbul</p>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="font-heading text-[80px] font-semibold text-white leading-[1.05] max-w-2xl">
            Her Sofra,<br />Bir Sanat{" "}<span className="italic text-gold">Eseridir.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }} className="font-body text-[15px] text-white/70 leading-[1.8] mt-4 max-w-md">
            İstanbul&apos;un kalbinden, el emeğiyle hazırlanan lezzetler sofralarınıza taşınıyor.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.9 }} className="flex gap-3 mt-6">
            <Link href="/menu" className="inline-flex items-center justify-center font-body text-sm font-medium tracking-wide bg-terracotta text-white px-8 py-4 rounded-none hover:bg-terracotta-dark transition-colors duration-300">Menüyü Keşfet →</Link>
            <Link href="/siparis" className="inline-flex items-center justify-center font-body text-sm font-medium tracking-wide border border-white/30 text-white px-8 py-4 rounded-none hover:bg-white/10 transition-colors duration-300">Sipariş Danışmanı</Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.1 }} className="flex flex-wrap gap-3 mt-8">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 px-4 py-2">
                <badge.icon size={15} className="text-gold" strokeWidth={1.5} />
                <span className="font-body text-[11px] text-white/80 tracking-wide">{badge.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.3 }} className="flex items-center gap-0 mt-8 pt-6 border-t border-white/10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                {i > 0 && <div className="w-px h-8 bg-white/15 mx-10" />}
                <div>
                  <p className="font-heading text-2xl font-bold text-gold">{stat.value}</p>
                  <p className="font-body text-[11px] text-white/50">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

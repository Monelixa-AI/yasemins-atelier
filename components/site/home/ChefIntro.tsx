"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "Gastronomi Mezunu & Sertifikalı Şef",
  "15+ Yıl Mutfak Deneyimi",
  "El Seçimi, Yerel & Mevsimsel Malzemeler",
];

export default function ChefIntro() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src="/images/chef-market.jpg"
                alt="Yasemin — Pazardan taze malzemeler"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Overlay card */}
            <div className="absolute bottom-6 right-6 bg-cream p-4 shadow-lg max-w-[200px]">
              <p className="font-body text-[10px] text-gold uppercase tracking-[0.15em] font-medium">
                ✦ Taze Malzeme
              </p>
              <p className="font-body text-[13px] text-brown-deep mt-1">
                Her sabah İstanbul pazarlarından
              </p>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="font-body text-[10px] text-gold uppercase tracking-[0.2em] font-medium mb-4">
              Şefle Tanışın
            </p>

            <h2 className="font-heading text-4xl lg:text-5xl text-brown-deep italic leading-tight">
              Gastronomi bir bilim,
              <br />
              lezzet ise bir sanattır.
            </h2>

            <p className="font-body text-[15px] text-brown-mid leading-[1.8] mt-6">
              Yasemin, İstanbul&apos;un köklü mutfak geleneğini modern
              gastronomi teknikleriyle buluşturan bir şeftir. Gastronomi
              eğitiminin verdiği disiplin ile büyükannesinin tariflerinden
              aldığı ilhamı her tabakta hissettiriyor.
            </p>

            <ul className="mt-8 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check size={16} className="text-terracotta shrink-0" />
                  <span className="font-body text-sm text-brown-deep">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/atelier"
              className="inline-block mt-8 font-body text-sm text-terracotta underline underline-offset-4 hover:text-terracotta-dark transition-colors"
            >
              Yasemin&apos;in Hikayesini Oku →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

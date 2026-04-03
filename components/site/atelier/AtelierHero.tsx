"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";


export default function AtelierHero() {
  return (
    <section className="relative min-h-[70vh] bg-brown-deep overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        {/* Left — text */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-col justify-center p-8 lg:p-16 relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-gold" />
            <p className="font-body text-[10px] text-gold font-medium uppercase tracking-[0.2em]">
              ✦ Şefle Tanışın
            </p>
          </div>

          <h1 className="font-heading leading-[0.9]">
            <span className="block text-7xl lg:text-[96px] text-white italic">
              Yasemin
            </span>
            <span className="block text-7xl lg:text-[96px] text-gold">
              Çiftçioğlu
            </span>
          </h1>

          <div className="mt-8">
            <div className="w-12 h-px bg-gold mb-3" />
            <p className="font-body text-sm text-white/70 tracking-[0.1em] uppercase">
              Gastronomi Şefi & Atelier Kurucusu
            </p>
          </div>

          <p className="font-heading text-[22px] text-white/80 italic leading-relaxed mt-8 max-w-md">
            &ldquo;Bir tabak sadece malzemelerden ibaret değildir.
            İçinde emek, sevgi ve bilim vardır.&rdquo;
          </p>

          <div className="flex items-center gap-4 mt-10">
            <a
              href="https://instagram.com/yaseminsatelier"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gold hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
            </a>
            <a
              href="https://wa.me/905XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-gold hover:text-white transition-colors"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </motion.div>

        {/* Right — image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative min-h-[400px] lg:min-h-0"
        >
          {/* Gradient overlay left edge */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brown-deep to-transparent z-10" />
          <Image
            src="/images/hero-chef.png"
            alt="Yasemin — Gastronomi Şefi"
            fill
            className="object-cover object-[95%_15%]"
            sizes="50vw"
            onError={() => {}}
          />
        </motion.div>
      </div>
    </section>
  );
}

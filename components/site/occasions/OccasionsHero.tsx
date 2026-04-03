"use client";

import { motion } from "framer-motion";

export default function OccasionsHero() {
  return (
    <section className="bg-cream py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <p className="font-body text-[10px] text-gold font-medium uppercase tracking-[0.2em]">
              ✦ Hangi Vesileyle?
            </p>
            <div className="w-8 h-px bg-gold" />
          </div>

          <h1 className="font-heading text-5xl lg:text-[60px] text-brown-deep leading-tight">
            Her Özel An İçin
            <br />
            Özenle Hazırlanmış Lezzetler
          </h1>

          <p className="font-body text-base text-brown-mid mt-6">
            9 farklı occasion, yüzlerce lezzet seçeneği.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

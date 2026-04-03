"use client";

import { motion } from "framer-motion";
import { Leaf, Scale, Heart } from "lucide-react";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

const principles = [
  {
    icon: Leaf,
    title: "Mevsimsel & Yerel",
    desc: "Her mevsim kendi lezzetini getirir. Pazardan taze, üreticiden direkt.",
  },
  {
    icon: Scale,
    title: "Bilimsel Denge",
    desc: "Lezzet tesadüf değildir. Her tarif, gastronomi biliminin üzerine kurulu.",
  },
  {
    icon: Heart,
    title: "El Emeği & Özen",
    desc: "Hiçbir ürünümüz endüstriyel değildir. Her tabak elle, özenle hazırlanır.",
  },
];

export default function AtelierPhilosophy() {
  return (
    <section className="py-24 bg-brown-deep overflow-hidden relative">
      {/* Decorative quote mark */}
      <span className="absolute -top-10 -left-10 font-heading text-[300px] text-gold/5 leading-none select-none">
        &ldquo;
      </span>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gold" />
              <p className="font-body text-[10px] text-gold font-medium uppercase tracking-[0.2em]">
                Malzeme Felsefesi
              </p>
            </div>

            <h2 className="font-heading text-4xl lg:text-[52px] text-white leading-[1.1]">
              Doğru malzeme,
              <br />
              doğru lezzeti
              <br />
              kendisi getirir.
            </h2>

            <div className="mt-10 space-y-8">
              {principles.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <p.icon size={22} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-white">
                      {p.title}
                    </h3>
                    <p className="font-body text-sm text-white/70 mt-1 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — image collage */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 gap-4"
          >
            <ImagePlaceholder
              aspectRatio="aspect-[4/3]"
              label="Pazar — Taze Malzemeler"
            />
            <ImagePlaceholder
              aspectRatio="aspect-[16/9]"
              label="Sofra Düzenleme"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

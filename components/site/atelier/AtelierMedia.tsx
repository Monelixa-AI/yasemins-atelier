"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import SectionHeader from "@/components/site/ui/SectionHeader";

const mediaLogos = [
  "Hürriyet Gastronomi",
  "TimeOut İstanbul",
  "Yemek.com",
  "GQ Türkiye",
  "Elle Gourmet",
  "Vogue Living",
];

export default function AtelierMedia() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Medya & Basında"
          title="Basında Yasemin's Atelier"
        />

        {/* Media logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {mediaLogos.map((name) => (
            <div
              key={name}
              className="h-16 bg-[#F5F5F0] border border-gold-light flex items-center justify-center"
            >
              <span className="font-body text-[13px] text-gold text-center px-2">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Video placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative aspect-video bg-brown-deep flex items-center justify-center cursor-pointer group">
            <div className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center group-hover:border-white group-hover:scale-110 transition-all duration-300">
              <Play size={28} className="text-white ml-1" fill="white" />
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center font-body text-sm text-white/50">
              Atölyemizden kısa film — yakında
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

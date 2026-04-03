"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";
import SectionHeader from "@/components/site/ui/SectionHeader";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

const certificates = [
  {
    id: 1,
    name: "Gastronomi Diploması",
    institution: "İstanbul Gastronomi Akademisi",
    year: "2010",
  },
  {
    id: 2,
    name: "Uluslararası Mutfak Teknikleri Sertifikası",
    institution: "European Culinary Institute",
    year: "2012",
  },
];

export default function AtelierCertificates() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-5xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Belgeler & Sertifikalar"
          title="Şeffaflık Güvenin Temelidir"
          subtitle="Tüm belgelerimizi müşterilerimizle paylaşmaktan gurur duyuyoruz."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gold-light p-6"
            >
              <button
                onClick={() => setLightbox(cert.id)}
                className="w-full relative group"
              >
                <ImagePlaceholder
                  aspectRatio="aspect-[4/3]"
                  label={cert.name}
                />
                <div className="absolute inset-0 bg-brown-deep/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="font-body text-sm text-white">
                    Büyütmek için tıkla
                  </span>
                </div>
              </button>

              <div className="mt-4">
                <h3 className="font-heading text-xl text-brown-deep">
                  {cert.name}
                </h3>
                <p className="font-body text-[13px] text-gold mt-1">
                  {cert.institution}
                </p>
                <p className="font-body text-xs text-brown-mid mt-1">
                  {cert.year}
                </p>
                <div className="flex items-center gap-1.5 mt-3 bg-[#EAF3DE] text-[#3B6D11] px-3 py-1.5 rounded-sm w-fit">
                  <CheckCircle size={14} />
                  <span className="font-body text-[11px] font-medium">
                    Doğrulanmış Belge
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="font-body text-[13px] text-brown-mid text-center italic mt-8">
          Hijyen sertifikamız ve diğer belgelerimiz talep üzerine
          paylaşılmaktadır.
        </p>

        {/* Lightbox */}
        <AnimatePresence>
          {lightbox !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setLightbox(null)}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-6 right-6 text-white hover:text-gold transition-colors"
                aria-label="Kapat"
              >
                <X size={28} />
              </button>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="max-w-3xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <ImagePlaceholder
                  aspectRatio="aspect-[4/3]"
                  label={
                    certificates.find((c) => c.id === lightbox)?.name ?? ""
                  }
                  className="w-full"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

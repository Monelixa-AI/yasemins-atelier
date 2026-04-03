"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ServicePackage } from "@/lib/data/services";
import SectionHeader from "@/components/site/ui/SectionHeader";

export default function ServicePackages({ packages, colorBg }: { packages: ServicePackage[]; colorBg: string }) {
  return (
    <section id="packages" className="py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow="Paketler" title="Size Uygun Paketi Seçin" />

        <div className={`grid grid-cols-1 md:grid-cols-${packages.length} gap-6`}>
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative bg-white border p-8 flex flex-col ${
                pkg.popular ? "border-terracotta shadow-lg scale-[1.02]" : "border-gold-light"
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-terracotta text-white font-body text-[10px] font-medium px-4 py-1 uppercase tracking-wider">
                  En Popüler
                </span>
              )}

              <h3 className="font-heading text-2xl text-brown-deep">{pkg.name}</h3>
              <p className="font-heading text-3xl font-bold text-terracotta mt-3">{pkg.price}</p>

              <ul className="mt-6 space-y-3 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check size={16} className="text-terracotta shrink-0 mt-0.5" />
                    <span className="font-body text-sm text-brown-mid">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full mt-8 py-4 font-body text-sm font-medium rounded-none transition-colors"
                style={{
                  backgroundColor: pkg.popular ? colorBg : "transparent",
                  color: pkg.popular ? "white" : colorBg,
                  border: pkg.popular ? "none" : `1.5px solid ${colorBg}`,
                }}
              >
                {pkg.price.includes("İletişim") ? "İletişime Geçin" : "Talep Oluştur"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

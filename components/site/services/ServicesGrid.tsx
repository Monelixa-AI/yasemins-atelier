"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/lib/data/services";
import SafeImage from "@/components/site/ui/SafeImage";

export default function ServicesGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={svc.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={`/hizmetler/${svc.slug}`} className="group block">
                <div className="relative overflow-hidden aspect-[4/3]">
                  <SafeImage src={svc.imageUrl} alt={svc.name} aspectRatio="aspect-[4/3]" fallbackLabel={svc.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-3xl">{svc.icon}</span>
                    <h3 className="font-heading text-2xl text-white mt-2">{svc.name}</h3>
                    <p className="font-body text-sm text-white/70 mt-1">{svc.tagline}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="font-body text-sm text-white font-medium bg-white/20 backdrop-blur-sm px-6 py-2">
                      Detayları Gör →
                    </span>
                  </div>
                </div>

                <div className="bg-cream p-4 border border-t-0 border-gold-light">
                  <p className="font-body text-[13px] text-brown-mid line-clamp-2">{svc.description}</p>
                  <p className="font-body text-xs text-terracotta mt-2 font-medium">
                    {svc.packages[0]?.price} &apos;den başlayan
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

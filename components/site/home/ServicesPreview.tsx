"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { services } from "@/lib/data/services";
import SectionHeader from "@/components/site/ui/SectionHeader";

export default function ServicesPreview() {
  return (
    <section className="py-20 bg-brown-deep">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Premium Deneyimler"
          title="Sipariş Ötesinde Hizmetler"
          subtitle="Yasemin'in kişisel dokunuşuyla, sofralarınıza ve etkinliklerinize özel deneyimler."
          light
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((svc, i) => (
            <motion.div
              key={svc.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/hizmetler/${svc.slug}`}
                className="group block bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 h-full"
              >
                <span className="text-3xl block mb-3">{svc.icon}</span>
                <h3 className="font-heading text-xl text-white group-hover:text-gold transition-colors">
                  {svc.name}
                </h3>
                <p className="font-body text-xs text-white/50 mt-2 leading-relaxed line-clamp-2">
                  {svc.tagline}
                </p>
                <span className="inline-block mt-4 font-body text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  Detaylar →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/hizmetler"
            className="inline-flex items-center font-body text-sm text-gold border border-gold/40 px-8 py-3 hover:bg-gold/10 transition-colors rounded-none"
          >
            Tüm Hizmetleri Gör →
          </Link>
        </div>
      </div>
    </section>
  );
}

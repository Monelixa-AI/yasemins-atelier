"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SectionHeader from "@/components/site/ui/SectionHeader";
import { occasions } from "@/lib/data/occasions";
import { products } from "@/lib/data/products";

export default function OccasionNav() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Özel Anlarınız İçin"
          title="Hangi Vesileyle?"
          subtitle="Her özel an için özenle hazırlanmış lezzetler"
        />

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {occasions.map((occ, i) => {
            const count = products.filter((p) => p.occasions.includes(occ.dbSlug)).length;
            return (
              <motion.div
                key={occ.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link href={`/occasions/${occ.slug}`}>
                  <div
                    className="group relative aspect-[4/3] flex flex-col items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-[1.03]"
                    style={{ backgroundColor: occ.colorBg }}
                  >
                    <span className="text-3xl mb-3">{occ.icon}</span>
                    <h3 className="font-heading text-xl text-white text-center">
                      {occ.name}
                    </h3>
                    <p className="font-body text-xs text-white/70 mt-1">
                      {count} ürün
                    </p>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-body text-sm text-white font-medium">
                        Keşfet →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4">
          {occasions.map((occ) => {
            const count = products.filter((p) => p.occasions.includes(occ.dbSlug)).length;
            return (
              <Link
                key={occ.slug}
                href={`/occasions/${occ.slug}`}
                className="snap-start shrink-0 w-[70vw]"
              >
                <div
                  className="relative aspect-[4/3] flex flex-col items-center justify-center overflow-hidden"
                  style={{ backgroundColor: occ.colorBg }}
                >
                  <span className="text-2xl mb-2">{occ.icon}</span>
                  <h3 className="font-heading text-lg text-white text-center">
                    {occ.name}
                  </h3>
                  <p className="font-body text-xs text-white/70 mt-1">
                    {count} ürün
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

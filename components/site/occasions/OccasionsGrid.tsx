"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { OccasionData } from "@/lib/data/occasions";
import { products } from "@/lib/data/products";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

export default function OccasionsGrid({ occasions }: { occasions: OccasionData[] }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Link href={`/occasions/${occ.slug}`} className="group block">
                  <div
                    className="relative aspect-[4/3] overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{ backgroundColor: occ.colorBg }}
                  >
                    <ImagePlaceholder
                      aspectRatio="aspect-[4/3]"
                      label=""
                      className="w-full h-full opacity-30"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl mb-2">{occ.icon}</span>
                      <h3 className="font-heading text-2xl text-white text-center">
                        {occ.name}
                      </h3>
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="font-body text-sm text-white font-medium">
                        Keşfet →
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 border border-t-0 border-gold-light">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{occ.icon}</span>
                      <h3 className="font-heading text-[22px] text-brown-deep">
                        {occ.name}
                      </h3>
                    </div>
                    <p className="font-body text-[13px] text-brown-mid mt-1">
                      {occ.tagline}
                    </p>
                    <p className="font-body text-xs text-gold mt-2">
                      {count} ürün
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

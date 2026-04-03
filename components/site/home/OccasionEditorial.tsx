"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import BrandButton from "@/components/site/ui/Button";

const featuredProducts = [
  { name: "Klasik Meze Tabağı", price: "280₺" },
  { name: "Misafir Ağırlama Seti", price: "680₺" },
  { name: "Ev Yapımı Su Böreği", price: "320₺" },
];

export default function OccasionEditorial() {
  return (
    <section className="bg-brown-deep overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
        {/* Left — Image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative min-h-[400px] lg:min-h-[600px]"
        >
          <Image
            src="/images/chef-table.jpg"
            alt="Misafir ağırlama sofrası"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>

        {/* Right — Content */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 lg:p-16 flex flex-col justify-center"
        >
          <p className="font-body text-[10px] text-gold uppercase tracking-[0.2em] font-medium mb-4">
            Bu Hafta Öne Çıkan
          </p>

          <h2 className="font-heading text-4xl lg:text-[56px] text-white leading-tight">
            Misafir Ağırlama
            <br />
            Sofrası
          </h2>

          <p className="font-body text-[15px] text-white/80 leading-[1.8] mt-6 max-w-lg">
            İlk izlenim her zaman önemlidir. Misafirlerinize sunacağınız
            sofrayı birlikte kuralım — onlara yakışır, size zaman kazandıran
            lezzetlerle.
          </p>

          {/* Product list */}
          <ul className="mt-8 space-y-0">
            {featuredProducts.map((p) => (
              <li
                key={p.name}
                className="flex items-center justify-between py-3 border-b border-gold/20"
              >
                <span className="font-body text-sm text-white">{p.name}</span>
                <span className="font-heading text-lg text-gold">{p.price}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link href="/occasions/misafir-agirlama">
              <BrandButton variant="outline" size="lg">
                Occasion&apos;ı Keşfet →
              </BrandButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

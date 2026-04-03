"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";

export default function MenuHero() {
  return (
    <section className="bg-brown-deep py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-5xl lg:text-[64px] text-white">
            Tüm Menü
          </h1>

          <div className="relative max-w-md mx-auto mt-8">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-mid/50" />
            <input
              type="text"
              placeholder="Ürün ara... (Mezeler, Börekler...)"
              className="w-full bg-white pl-11 pr-4 py-4 font-body text-sm text-brown-deep placeholder:text-brown-mid/50 rounded-none focus:outline-none"
              readOnly
            />
          </div>

          <p className="font-body text-sm text-white/60 mt-4">
            {products.length} ürün, {categories.length} kategori
          </p>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import type { ProductData } from "@/lib/data/products";
import SectionHeader from "@/components/site/ui/SectionHeader";
import ProductCard from "@/components/site/product/ProductCard";

type Filter = "all" | "popular" | "price-asc" | "vegan" | "gluten-free";

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "Tümü" },
  { key: "popular", label: "En Popüler" },
  { key: "price-asc", label: "Fiyat: Düşük→Yüksek" },
  { key: "vegan", label: "Vegan" },
  { key: "gluten-free", label: "Glutensiz" },
];

export default function OccasionProducts({
  products,
  occasionName,
}: {
  products: ProductData[];
  occasionName: string;
}) {
  const [active, setActive] = useState<Filter>("all");

  const filtered = (() => {
    let list = [...products];
    switch (active) {
      case "popular":
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "price-asc":
        list.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "vegan":
        list = list.filter((p) => p.isVegan);
        break;
      case "gluten-free":
        list = list.filter((p) => p.isGlutenFree);
        break;
    }
    return list;
  })();

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow={`${occasionName.toUpperCase()} İÇİN`}
          title="Önerilen Lezzetler"
        />

        {/* Filter pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={`font-body text-xs px-4 py-2 rounded-none transition-all duration-200 ${
                active === f.key
                  ? "bg-terracotta text-white"
                  : "border border-gold/40 text-brown-mid hover:border-terracotta hover:text-terracotta"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center font-body text-sm text-brown-mid py-8">
            Bu filtreye uygun ürün bulunamadı.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  slug: product.slug,
                  name: product.name,
                  category: "",
                  shortDesc: product.shortDesc,
                  price: product.basePrice,
                  imageUrl: product.images[0] ?? "",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

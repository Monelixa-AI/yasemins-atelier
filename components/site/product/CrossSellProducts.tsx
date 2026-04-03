"use client";

import SectionHeader from "@/components/site/ui/SectionHeader";
import ProductCard from "./ProductCard";
import { products as allProducts } from "@/lib/data/products";

export default function CrossSellProducts({ productId, categoryId }: { productId: string; categoryId: string }) {
  const related = allProducts
    .filter((p) => p.id !== productId && p.categoryId === categoryId)
    .slice(0, 4);

  const fallback = related.length > 0
    ? related
    : allProducts.filter((p) => p.id !== productId).slice(0, 4);

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader eyebrow="Öneri" title="Bunlarla Birlikte İyi Gider" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {fallback.map((p) => (
            <ProductCard
              key={p.id}
              product={{ slug: p.slug, name: p.name, category: "", shortDesc: p.shortDesc, price: p.basePrice, imageUrl: p.images[0] ?? "" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

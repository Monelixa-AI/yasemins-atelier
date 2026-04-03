"use client";

import SectionHeader from "@/components/site/ui/SectionHeader";
import { naturelProducts } from "@/lib/data/naturel-products";
import NaturelProductCard from "./NaturelProductCard";

export default function NaturelFeatured() {
  const featured = naturelProducts.filter((p) => p.isFeatured);

  return (
    <section className="py-20" style={{ backgroundColor: "#F5F0E8" }}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="ÖNCÜ ÜRÜNLER"
          title="Yasemin'in Favorileri"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <NaturelProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

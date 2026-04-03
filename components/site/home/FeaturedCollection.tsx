"use client";

import Link from "next/link";
import SectionHeader from "@/components/site/ui/SectionHeader";
import ProductCard from "@/components/site/product/ProductCard";
import { products } from "@/lib/data/products";

const featuredProducts = products
  .filter((p) => p.isFeatured)
  .slice(0, 4);

export default function FeaturedCollection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <SectionHeader
          eyebrow="Bu Hafta Özel"
          title="Şefin Bu Hafta Seçtikleri"
          subtitle="Yasemin'in özenle seçtiği bu haftanın özel lezzetleri"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.slug}
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

        <div className="text-right mt-8">
          <Link
            href="/menu"
            className="font-body text-sm text-terracotta hover:text-terracotta-dark transition-colors underline underline-offset-4"
          >
            Tüm Menüyü Gör →
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import type { ProductData } from "@/lib/data/products";
import DietBadges from "./DietBadges";
import RatingStars from "./RatingStars";
import ImagePlaceholder from "@/components/site/ui/ImagePlaceholder";

export default function ProductRow({ product }: { product: ProductData }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gold-light">
      <div className="w-20 h-20 shrink-0">
        <ImagePlaceholder aspectRatio="aspect-square" label="" className="w-full h-full" />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/urunler/${product.slug}`}>
          <h3 className="font-heading text-lg text-brown-deep hover:text-terracotta transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <p className="font-body text-xs text-brown-mid mt-0.5 line-clamp-1">
          {product.shortDesc}
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <DietBadges isVegan={product.isVegan} isGlutenFree={product.isGlutenFree} />
          <RatingStars rating={product.avgRating} reviewCount={product.reviewCount} />
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-heading text-xl font-bold text-terracotta">
          {product.basePrice}₺
        </p>
        {product.variants.length > 1 && (
          <p className="font-body text-[10px] text-brown-mid">{product.variants.length} seçenek</p>
        )}
        <button className="mt-2 font-body text-xs bg-terracotta text-white px-4 py-1.5 rounded-none hover:bg-terracotta-dark transition-colors">
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}

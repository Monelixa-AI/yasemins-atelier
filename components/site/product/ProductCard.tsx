"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import Badge from "@/components/site/ui/Badge";
import SafeImage from "@/components/site/ui/SafeImage";

export interface ProductCardData {
  slug: string;
  name: string;
  category: string;
  shortDesc: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="group relative flex flex-col h-full">
      {/* Image */}
      <Link href={`/urunler/${product.slug}`} className="relative block overflow-hidden bg-cream">
        <SafeImage
          src={product.imageUrl}
          alt={product.name}
          aspectRatio="aspect-square"
          fallbackLabel={product.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Favorite button */}
        <button
          onClick={() => setLiked(!liked)}
          aria-label="Favorilere ekle"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full transition-colors hover:bg-white"
        >
          <Heart
            size={16}
            className={liked ? "text-terracotta fill-terracotta" : "text-brown-mid"}
          />
        </button>
      </Link>

      {/* Info */}
      <div className="pt-4 flex flex-col flex-1">
        {product.category && (
          <Badge variant="category">{product.category}</Badge>
        )}

        <Link href={`/urunler/${product.slug}`}>
          <h3 className="font-heading text-xl text-brown-deep mt-2 hover:text-terracotta transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="font-body text-[13px] text-brown-mid mt-1 line-clamp-2 flex-1">
          {product.shortDesc}
        </p>

        <p className="font-heading text-[22px] font-bold text-terracotta mt-3">
          {product.price}₺
        </p>

        <button className="w-full mt-3 py-3 bg-terracotta text-white font-body text-sm font-medium hover:bg-terracotta-dark transition-colors duration-300 rounded-none">
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}

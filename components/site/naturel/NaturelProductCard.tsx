"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Star } from "lucide-react";
import SafeImage from "@/components/site/ui/SafeImage";
import { useCartStore } from "@/store/cart";
import type { NaturelProductData } from "@/lib/data/naturel-products";

interface NaturelProductCardProps {
  product: NaturelProductData;
}

export default function NaturelProductCard({ product }: NaturelProductCardProps) {
  const [liked, setLiked] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      imageUrl: product.images[0] ?? "",
    });
  };

  const isLowStock = product.stockCount > 0 && product.stockCount < 10;

  return (
    <div className="group relative flex flex-col h-full bg-white">
      {/* Image Area */}
      <Link
        href={`/naturel/urunler/${product.slug}`}
        className="relative block overflow-hidden"
      >
        <SafeImage
          src={product.images[0] ?? ""}
          alt={product.name}
          aspectRatio="aspect-square"
          fallbackLabel={product.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Low Stock Badge */}
        {isLowStock && (
          <span
            className="absolute top-3 left-3 z-10 font-body text-[11px] font-medium text-white px-3 py-1"
            style={{ backgroundColor: "#C4622D" }}
          >
            Son {product.stockCount} adet!
          </span>
        )}

        {/* Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setLiked(!liked);
          }}
          aria-label="Favorilere ekle"
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full transition-colors hover:bg-white"
        >
          <Heart
            size={16}
            className={
              liked
                ? "text-[#C4622D] fill-[#C4622D]"
                : "text-brown-deep/40"
            }
          />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="inline-block font-body text-[10px] font-medium uppercase tracking-wider px-2 py-0.5"
                style={{ backgroundColor: "#EAF3DE", color: "#2D4A1E" }}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Name */}
        <Link href={`/naturel/urunler/${product.slug}`}>
          <h3 className="font-heading text-[20px] text-brown-deep hover:text-[#4A7C3F] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="font-body text-[13px] text-brown-deep/60 mt-1 line-clamp-2 flex-1">
          {product.shortDesc}
        </p>

        {/* Weight + Rating */}
        <div className="flex items-center justify-between mt-3">
          <span className="font-body text-[12px] text-brown-deep/50">
            {product.weightGrams}g
          </span>
          <div className="flex items-center gap-1">
            <Star size={13} className="text-[#B8975C] fill-[#B8975C]" />
            <span className="font-body text-[12px] text-brown-deep/70">
              {product.avgRating} ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Price */}
        <p
          className="font-heading text-[22px] font-bold mt-2"
          style={{ color: "#C4622D" }}
        >
          {product.basePrice}\u20BA
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full mt-3 py-3 text-white font-body text-sm font-medium transition-colors duration-300 rounded-none"
          style={{ backgroundColor: "#4A7C3F" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#2D4A1E")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#4A7C3F")
          }
        >
          Sepete Ekle
        </button>

        {/* Cargo Note */}
        <p className="font-body text-[11px] text-brown-deep/50 text-center mt-2">
          \uD83D\uDE9A 750\u20BA \u00FCzeri \u00FCcretsiz kargo
        </p>
      </div>
    </div>
  );
}

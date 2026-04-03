"use client";

import { useState, useEffect } from "react";
import { Heart, Clock, Package, Check, RotateCcw, MessageCircle } from "lucide-react";
import type { ProductData, ProductVariant } from "@/lib/data/products";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import DietBadges from "./DietBadges";
import RatingStars from "./RatingStars";

export default function ProductInfo({ product }: { product: ProductData }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length === 1 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [mounted, setMounted] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const toggleItem = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist);

  useEffect(() => setMounted(true), []);

  const totalPrice = product.basePrice + (selectedVariant?.priceAdd ?? 0);
  const inWishlist = mounted && isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.name,
      name: product.name,
      variantName: selectedVariant?.name,
      price: totalPrice,
      imageUrl: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div>
      {/* Category */}
      <p className="font-body text-xs text-gold uppercase tracking-[0.15em]">
        {product.categoryId}
      </p>

      {/* Name */}
      <h1 className="font-heading text-4xl text-brown-deep mt-2">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-3 mt-3">
        <RatingStars rating={product.avgRating} reviewCount={product.reviewCount} />
        <a href="#reviews" className="font-body text-xs text-gold hover:text-terracotta transition-colors">
          ({product.reviewCount} değerlendirme)
        </a>
      </div>

      {/* Diet badges */}
      <div className="mt-3">
        <DietBadges isVegan={product.isVegan} isGlutenFree={product.isGlutenFree} />
      </div>

      {/* Price */}
      <div className="mt-6">
        <p className="font-heading text-4xl font-bold text-terracotta">
          {totalPrice}₺
          {!selectedVariant && product.variants.length > 1 && (
            <span className="font-body text-sm text-brown-mid font-normal ml-2">
              &apos;den başlayan
            </span>
          )}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-body text-xs text-brown-mid">Stokta mevcut</span>
        </div>
      </div>

      {/* Variants */}
      {product.variants.length > 1 && (
        <div className="mt-6">
          <p className="font-body text-sm text-brown-deep font-medium mb-3">Porsiyon Seçin:</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.name}
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-2.5 font-body text-sm border transition-all ${
                  selectedVariant?.name === v.name
                    ? "bg-terracotta text-white border-terracotta"
                    : "border-gold-light text-brown-deep hover:border-terracotta"
                }`}
              >
                {v.name}
                <span className="ml-1.5 text-xs opacity-70">
                  {v.priceAdd === 0 ? "Dahil" : `+${v.priceAdd}₺`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mt-6 flex items-center gap-3">
        <span className="font-body text-sm text-brown-deep">Adet:</span>
        <div className="flex items-center border border-gold-light">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-brown-mid hover:text-terracotta"
          >
            −
          </button>
          <span className="w-10 h-10 flex items-center justify-center font-body text-sm text-brown-deep border-x border-gold-light">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="w-10 h-10 flex items-center justify-center text-brown-mid hover:text-terracotta"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <div className="mt-6 space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={product.variants.length > 1 && !selectedVariant}
          className={`w-full py-4 font-body text-[15px] font-medium rounded-none transition-all duration-300 ${
            added
              ? "bg-green-600 text-white"
              : "bg-terracotta text-white hover:bg-terracotta-dark disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {added ? "✓ Sepete Eklendi" : "Sepete Ekle"}
        </button>

        <button
          onClick={() => toggleItem(product.id)}
          className="w-full py-3 font-body text-sm border border-gold-light text-brown-deep hover:border-terracotta hover:text-terracotta transition-colors rounded-none flex items-center justify-center gap-2"
        >
          <Heart size={16} className={inWishlist ? "fill-terracotta text-terracotta" : ""} />
          {inWishlist ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        </button>
      </div>

      {/* Info lines */}
      <div className="mt-8 space-y-3">
        {[
          { icon: Clock, text: "24 saat öncesi sipariş" },
          { icon: Package, text: "İstanbul geneli teslimat" },
          { icon: Check, text: "Taze hazırlanır" },
          { icon: RotateCcw, text: "12 saat öncesi iptale kadar" },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3">
            <Icon size={14} className="text-gold shrink-0" />
            <span className="font-body text-xs text-brown-mid">{text}</span>
          </div>
        ))}
      </div>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/905XXXXXXXXX?text=${encodeURIComponent(`Merhaba, ${product.name} hakkında bilgi almak istiyorum.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 w-full py-3 font-body text-sm border border-[#25D366] text-[#25D366] rounded-none flex items-center justify-center gap-2 hover:bg-[#25D366]/10 transition-colors"
      >
        <MessageCircle size={16} />
        WhatsApp&apos;tan Sor
      </a>
    </div>
  );
}

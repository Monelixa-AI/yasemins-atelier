"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/site/product/ProductCard";

export default function FavorilerimPage() {
  const [mounted, setMounted] = useState(false);
  const { items } = useWishlistStore();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const wishlistProducts = products.filter((p) => items.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <h1 className="font-heading text-4xl text-brown-deep">
        Favorilerim <span className="font-body text-lg text-gold">({wishlistProducts.length})</span>
      </h1>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Heart size={48} className="text-gold-light mb-4" />
          <p className="font-heading text-xl text-brown-deep">Favori ürün eklemediniz</p>
          <Link
            href="/menu"
            className="mt-4 font-body text-sm bg-terracotta text-white px-6 py-3 hover:bg-terracotta-dark transition-colors"
          >
            Menüyü Keşfet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {wishlistProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={{ slug: p.slug, name: p.name, category: "", shortDesc: p.shortDesc, price: p.basePrice, imageUrl: p.images[0] ?? "" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

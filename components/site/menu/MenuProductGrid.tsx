"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import type { ProductData } from "@/lib/data/products";
import ProductCard from "@/components/site/product/ProductCard";
import ProductRow from "@/components/site/product/ProductRow";

type SortKey = "recommended" | "price-asc" | "price-desc" | "newest" | "popular";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "recommended", label: "Önerilen" },
  { key: "price-asc", label: "Fiyat ↑" },
  { key: "price-desc", label: "Fiyat ↓" },
  { key: "popular", label: "En Popüler" },
];

export default function MenuProductGrid({ products }: { products: ProductData[] }) {
  const [sort, setSort] = useState<SortKey>("recommended");
  const [view, setView] = useState<"grid" | "list">("grid");

  const sorted = [...products].sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.basePrice - b.basePrice;
      case "price-desc": return b.basePrice - a.basePrice;
      case "popular": return b.reviewCount - a.reviewCount;
      default: return 0;
    }
  });

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-body text-[13px] text-brown-mid">
          {products.length} ürün bulundu
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="font-body text-xs border border-gold-light px-3 py-2 rounded-none bg-white text-brown-deep focus:outline-none focus:border-terracotta appearance-none"
          >
            {sortOptions.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
          <div className="flex border border-gold-light">
            <button
              onClick={() => setView("grid")}
              className={`p-2 ${view === "grid" ? "bg-terracotta text-white" : "text-brown-mid hover:text-terracotta"}`}
              aria-label="Grid görünüm"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 ${view === "list" ? "bg-terracotta text-white" : "text-brown-mid hover:text-terracotta"}`}
              aria-label="Liste görünüm"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      {sorted.length === 0 ? (
        <p className="text-center font-body text-sm text-brown-mid py-12">
          Bu filtreye uygun ürün bulunamadı.
        </p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {sorted.map((product) => (
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
      ) : (
        <div>
          {sorted.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

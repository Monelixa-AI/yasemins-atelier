"use client";

import { useState } from "react";
import { naturelProducts, naturelCategories } from "@/lib/data/naturel-products";
import NaturelProductCard from "@/components/site/naturel/NaturelProductCard";

type SortKey = "recommended" | "price-asc" | "price-desc" | "rating";

export default function NaturelUrunlerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState({ vegan: false, glutenFree: false, childFriendly: false, inStock: false });
  const [sort, setSort] = useState<SortKey>("recommended");

  const filtered = naturelProducts.filter((p) => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (filters.vegan && !p.isVegan) return false;
    if (filters.glutenFree && !p.isGlutenFree) return false;
    if (filters.childFriendly && p.categoryId !== "cocuk-serisi") return false;
    if (filters.inStock && (p.stockCount ?? 0) <= 0) return false;
    return true;
  }).sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.basePrice - b.basePrice;
      case "price-desc": return b.basePrice - a.basePrice;
      case "rating": return b.avgRating - a.avgRating;
      default: return 0;
    }
  });

  return (
    <>
      {/* Hero */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #2D4A1E, #3D1A0A)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-5xl text-white">Tüm Naturel Ürünler</h1>
          <p className="font-body text-base text-white/70 mt-4">Katkısız, el yapımı, Türkiye geneli kargo · 📦 750₺ üzeri ücretsiz</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="p-6 bg-cream border border-[#EAF3DE] h-fit lg:sticky lg:top-[100px]">
            <h3 className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-[#4A7C3F] mb-4">Kategoriler</h3>
            <button onClick={() => setSelectedCategory(null)} className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${!selectedCategory ? "text-[#4A7C3F] font-medium" : "text-brown-deep hover:text-[#4A7C3F]"}`}>
              Tüm Ürünler ({naturelProducts.length})
            </button>
            {naturelCategories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`block w-full text-left font-body text-sm py-1.5 transition-colors ${selectedCategory === cat.id ? "text-[#4A7C3F] font-medium" : "text-brown-deep hover:text-[#4A7C3F]"}`}>
                {cat.emoji} {cat.name}
              </button>
            ))}

            <div className="mt-6 pt-4 border-t border-[#EAF3DE]">
              <h3 className="font-body text-[11px] font-medium uppercase tracking-[0.15em] text-[#4A7C3F] mb-3">Filtreler</h3>
              {[
                { key: "vegan", label: "Vegan" },
                { key: "glutenFree", label: "Glutensiz" },
                { key: "childFriendly", label: "Çocuk Dostu" },
                { key: "inStock", label: "Stoktakiler" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input type="checkbox" checked={filters[key as keyof typeof filters]} onChange={(e) => setFilters({ ...filters, [key]: e.target.checked })} className="accent-[#4A7C3F]" />
                  <span className="font-body text-sm text-brown-deep">{label}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="font-body text-[13px] text-brown-mid">{filtered.length} ürün</p>
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="font-body text-xs border border-[#EAF3DE] px-3 py-2 rounded-none bg-white text-brown-deep focus:outline-none">
                <option value="recommended">Önerilen</option>
                <option value="price-asc">Fiyat ↑</option>
                <option value="price-desc">Fiyat ↓</option>
                <option value="rating">En İyi Puan</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <NaturelProductCard key={p.id} product={p} />
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-center font-body text-sm text-brown-mid py-12">Bu filtreye uygun ürün bulunamadı.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

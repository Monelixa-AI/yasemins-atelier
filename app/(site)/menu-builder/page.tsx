"use client";

import { useState } from "react";
import Link from "next/link";
import { occasions } from "@/lib/data/occasions";
import { products } from "@/lib/data/products";
import { useCartStore } from "@/store/cart";
import ProductCard from "@/components/site/product/ProductCard";
import SectionHeader from "@/components/site/ui/SectionHeader";

export default function MenuBuilderPage() {
  const [step, setStep] = useState(1);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(4);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  const occasionProducts = selectedOccasion
    ? products.filter((p) => p.occasions.includes(selectedOccasion))
    : products;

  const selected = products.filter((p) => selectedProducts.includes(p.id));
  const total = selected.reduce((sum, p) => sum + p.basePrice, 0);

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const addAllToCart = () => {
    selected.forEach((p) => {
      addItem({ productId: p.id, name: p.name, price: p.basePrice, imageUrl: p.images[0] });
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-12">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-medium ${step >= s ? "bg-terracotta text-white" : "bg-gold-light text-brown-mid"}`}>{s}</div>
            {s < 4 && <div className={`w-12 h-0.5 ${step > s ? "bg-terracotta" : "bg-gold-light"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 — Occasion */}
      {step === 1 && (
        <div>
          <SectionHeader eyebrow="Adım 1" title="Hangi Vesileyle?" subtitle={`${guestCount} kişilik sofranız için`} />
          <div className="max-w-xs mx-auto mb-10">
            <label className="font-body text-sm text-brown-mid block mb-2">Kişi Sayısı: {guestCount}</label>
            <input type="range" min={2} max={50} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="w-full accent-terracotta" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {occasions.map((occ) => (
              <button key={occ.slug} onClick={() => { setSelectedOccasion(occ.dbSlug); setStep(2); }}
                className="p-6 border border-gold-light hover:border-terracotta transition-colors text-center group">
                <span className="text-3xl block mb-2">{occ.icon}</span>
                <span className="font-heading text-lg text-brown-deep group-hover:text-terracotta transition-colors">{occ.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Product selection */}
      {step === 2 && (
        <div>
          <SectionHeader eyebrow="Adım 2" title="Ürünlerinizi Seçin" subtitle={`${selectedProducts.length} ürün seçildi · Tahmini toplam: ${total}₺`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasionProducts.map((p) => (
              <div key={p.id} className={`relative ${selectedProducts.includes(p.id) ? "ring-2 ring-terracotta" : ""}`}>
                <ProductCard product={{ slug: p.slug, name: p.name, category: "", shortDesc: p.shortDesc, price: p.basePrice, imageUrl: p.images[0] ?? "" }} />
                <button onClick={() => toggleProduct(p.id)}
                  className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-bold ${selectedProducts.includes(p.id) ? "bg-terracotta text-white" : "bg-white border border-gold-light text-brown-mid"}`}>
                  {selectedProducts.includes(p.id) ? "✓" : "+"}
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center mt-10">
            <button onClick={() => setStep(1)} className="font-body text-sm text-brown-mid border border-gold-light px-6 py-3 hover:border-terracotta transition-colors">← Geri</button>
            <button onClick={() => setStep(3)} disabled={selectedProducts.length === 0} className="font-body text-sm bg-terracotta text-white px-8 py-3 hover:bg-terracotta-dark transition-colors disabled:opacity-50">Devam →</button>
          </div>
        </div>
      )}

      {/* Step 3 — Summary */}
      {step === 3 && (
        <div className="max-w-2xl mx-auto">
          <SectionHeader eyebrow="Adım 3" title="Menünüzün Özeti" />
          <div className="space-y-3 mb-8">
            {selected.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3 border-b border-gold-light">
                <div>
                  <p className="font-body text-sm text-brown-deep font-medium">{p.name}</p>
                  <p className="font-body text-xs text-brown-mid">{p.shortDesc}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-heading text-lg font-bold text-terracotta">{p.basePrice}₺</p>
                  <button onClick={() => toggleProduct(p.id)} className="font-body text-xs text-red-500 hover:text-red-700">Çıkar</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-cream p-6 mb-8">
            <div className="flex justify-between font-heading text-2xl"><span className="text-brown-deep">Toplam</span><span className="font-bold text-terracotta">{total}₺</span></div>
            <p className="font-body text-xs text-brown-mid mt-2">{guestCount} kişi · Kişi başı ~{Math.round(total / guestCount)}₺</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={() => setStep(2)} className="font-body text-sm text-brown-mid border border-gold-light px-6 py-3 hover:border-terracotta transition-colors">← Düzenle</button>
            <button onClick={() => { addAllToCart(); setStep(4); }} className="font-body text-sm bg-terracotta text-white px-8 py-3 hover:bg-terracotta-dark transition-colors">Sepete Ekle ✓</button>
          </div>
        </div>
      )}

      {/* Step 4 — Done */}
      {step === 4 && (
        <div className="max-w-md mx-auto text-center py-12">
          <span className="text-5xl block mb-4">🎉</span>
          <h2 className="font-heading text-3xl text-brown-deep">Harika Seçim!</h2>
          <p className="font-body text-sm text-brown-mid mt-3">{selected.length} ürün sepetinize eklendi.</p>
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/checkout" className="font-body text-sm bg-terracotta text-white px-8 py-3 hover:bg-terracotta-dark transition-colors">Siparişi Tamamla</Link>
            <Link href="/menu" className="font-body text-sm text-brown-mid border border-gold-light px-6 py-3 hover:border-terracotta transition-colors">Alışverişe Devam</Link>
          </div>
        </div>
      )}
    </div>
  );
}

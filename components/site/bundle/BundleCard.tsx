"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { BundleData } from "@/lib/data/bundles";
import { products } from "@/lib/data/products";
import { useCartStore } from "@/store/cart";
import SafeImage from "@/components/site/ui/SafeImage";

export default function BundleCard({ bundle }: { bundle: BundleData }) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem({
      productId: bundle.id,
      bundleId: bundle.id,
      name: bundle.name,
      price: bundle.price,
      imageUrl: bundle.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const itemNames = bundle.items.map((bi) => {
    const p = products.find((pr) => pr.id === bi.productId);
    return p?.name ?? bi.productId;
  });

  return (
    <div className="border border-gold-light bg-white">
      <div className="relative">
        <SafeImage src={bundle.imageUrl} alt={bundle.name} aspectRatio="aspect-[4/3]" fallbackLabel={bundle.name} />
        <span className="absolute top-3 right-3 bg-terracotta text-white font-body text-xs font-medium px-3 py-1">
          {bundle.saving}₺ TASARRUF
        </span>
      </div>

      <div className="p-6">
        <h3 className="font-heading text-2xl text-brown-deep">{bundle.name}</h3>
        <p className="font-body text-[13px] text-brown-mid mt-1">{bundle.description}</p>

        <ul className="mt-4 space-y-1.5">
          {itemNames.map((name, i) => (
            <li key={i} className="flex items-center gap-2 font-body text-xs text-brown-mid">
              <Check size={14} className="text-terracotta shrink-0" />
              {name}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="font-heading text-3xl font-bold text-terracotta">{bundle.price}₺</span>
          <span className="font-body text-sm text-brown-mid line-through">{bundle.normalPrice}₺</span>
        </div>
        <p className="font-body text-xs text-[#4A7C3F] mt-1">{bundle.saving}₺ tasarruf ediyorsunuz</p>

        <button
          onClick={handleAdd}
          className={`w-full mt-4 py-3 font-body text-sm font-medium rounded-none transition-all duration-300 ${
            added ? "bg-green-600 text-white" : "bg-terracotta text-white hover:bg-terracotta-dark"
          }`}
        >
          {added ? "✓ Sepete Eklendi" : "Paketi Sepete Ekle"}
        </button>
      </div>
    </div>
  );
}

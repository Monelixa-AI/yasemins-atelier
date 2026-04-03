"use client";

import { useState } from "react";
import type { ProductData } from "@/lib/data/products";

const tabs = ["Açıklama", "İçindekiler & Allerjenler", "Teslimat Bilgisi"] as const;

export default function ProductDescription({ product }: { product: ProductData }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="mt-16 max-w-4xl">
      {/* Tab headers */}
      <div className="flex border-b border-gold-light">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-6 py-3 font-body text-sm transition-colors ${
              activeTab === i
                ? "text-terracotta border-b-2 border-terracotta -mb-px"
                : "text-brown-mid hover:text-brown-deep"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === 0 && (
          <div>
            <p className="font-body text-[15px] text-brown-mid leading-[1.9]">{product.shortDesc}</p>
          </div>
        )}

        {activeTab === 1 && (
          <div className="space-y-6">
            {product.allergens.length > 0 && (
              <div>
                <h4 className="font-body text-sm font-medium text-brown-deep mb-2">Allerjenler:</h4>
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map((a) => (
                    <span key={a} className="bg-red-50 text-red-700 font-body text-xs px-3 py-1 rounded-sm">{a}</span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="font-body text-sm font-medium text-brown-deep mb-2">Diyet Uygunluğu:</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Vegan", ok: product.isVegan },
                  { label: "Glutensiz", ok: product.isGlutenFree },
                ].map((d) => (
                  <div key={d.label} className="flex items-center gap-2 font-body text-sm">
                    <span className={d.ok ? "text-green-600" : "text-red-400"}>{d.ok ? "✓" : "✗"}</span>
                    <span className="text-brown-mid">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-3 font-body text-sm text-brown-mid">
            <p>🕐 <strong>Hazırlık süresi:</strong> Siparişten 24 saat sonra hazır</p>
            <p>📦 <strong>Teslimat bölgeleri:</strong> Tüm İstanbul ilçeleri</p>
            <p>⏰ <strong>Teslimat saatleri:</strong> 10:00 - 21:00</p>
            <p>💰 <strong>Minimum sipariş:</strong> 300₺</p>
            <p>↩️ <strong>İptal:</strong> Teslimat saatinden 12 saat öncesine kadar</p>
          </div>
        )}
      </div>
    </div>
  );
}

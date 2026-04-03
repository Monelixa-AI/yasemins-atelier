"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";

interface OrderSummaryProps {
  discount?: number;
  deliveryFee?: number;
}

export default function OrderSummary({ discount = 0, deliveryFee }: OrderSummaryProps) {
  const [mounted, setMounted] = useState(false);
  const { items, getSubtotal } = useCartStore();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const subtotal = getSubtotal();
  const fee = deliveryFee ?? (subtotal >= 500 ? 0 : 50);
  const total = subtotal + fee - discount;

  return (
    <div className="bg-cream border border-gold-light p-5">
      <h3 className="font-heading text-lg text-brown-deep mb-4">Siparis Ozeti</h3>

      {/* Item list */}
      <div className="space-y-2.5 max-h-[260px] overflow-y-auto mb-4 pr-1">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex items-start justify-between gap-2"
          >
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-brown-deep truncate">{item.name}</p>
              {item.variantName && (
                <p className="font-body text-[11px] text-brown-mid">{item.variantName}</p>
              )}
              <p className="font-body text-[11px] text-brown-mid">x{item.quantity}</p>
            </div>
            <span className="font-body text-sm text-brown-deep font-medium shrink-0">
              {item.price * item.quantity}&#x20BA;
            </span>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="border-t border-gold-light pt-3 space-y-2">
        <div className="flex justify-between font-body text-sm">
          <span className="text-brown-mid">Ara Toplam</span>
          <span className="text-brown-deep">{subtotal}&#x20BA;</span>
        </div>

        <div className="flex justify-between font-body text-sm">
          <span className="text-brown-mid">Teslimat</span>
          <span className="text-brown-deep">
            {fee === 0 ? "Ucretsiz" : `${fee}\u20BA`}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between font-body text-sm">
            <span className="text-green-600">Indirim</span>
            <span className="text-green-600">-{discount}&#x20BA;</span>
          </div>
        )}

        <div className="border-t border-gold-light pt-2 flex justify-between">
          <span className="font-body text-sm text-brown-deep font-medium">Toplam</span>
          <span className="font-heading text-xl text-terracotta font-bold">
            {total}&#x20BA;
          </span>
        </div>
      </div>

      {subtotal < 500 && (
        <p className="font-body text-[10px] text-brown-mid mt-3">
          500&#x20BA; ve uzeri siparislerde ucretsiz teslimat!
        </p>
      )}
    </div>
  );
}

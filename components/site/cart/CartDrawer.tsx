"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import SafeImage from "@/components/site/ui/SafeImage";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-full max-w-md bg-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold-light">
              <h2 className="font-heading text-2xl text-brown-deep">
                Sepetim <span className="font-body text-sm text-gold">({items.length})</span>
              </h2>
              <button onClick={closeCart} className="text-brown-mid hover:text-brown-deep" aria-label="Kapat">
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <ShoppingBag size={48} className="text-gold-light mb-4" />
                <p className="font-heading text-xl text-brown-deep">Sepetiniz boş</p>
                <Link
                  href="/menu"
                  onClick={closeCart}
                  className="mt-4 font-body text-sm text-terracotta hover:text-terracotta-dark underline underline-offset-4"
                >
                  Menüyü Keşfet
                </Link>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 pb-4 border-b border-gold-light/50">
                    <div className="w-16 h-16 shrink-0">
                      <SafeImage src={item.imageUrl ?? ""} alt={item.name} aspectRatio="aspect-square" fallbackLabel="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-brown-deep font-medium truncate">{item.name}</p>
                      {item.variantName && (
                        <p className="font-body text-xs text-brown-mid">{item.variantName}</p>
                      )}
                      <p className="font-heading text-base font-bold text-terracotta mt-1">
                        {item.price * item.quantity}₺
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="w-7 h-7 border border-gold-light flex items-center justify-center text-brown-mid hover:text-terracotta"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-body text-sm text-brown-deep w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="w-7 h-7 border border-gold-light flex items-center justify-center text-brown-mid hover:text-terracotta"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      className="text-brown-mid/50 hover:text-red-500 self-start"
                      aria-label="Sil"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-gold-light space-y-3">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-brown-mid">Ara Toplam</span>
                  <span className="font-heading text-xl font-bold text-brown-deep">{getSubtotal()}₺</span>
                </div>
                <p className="font-body text-[10px] text-brown-mid">
                  Teslimat ücreti sipariş adımında hesaplanır.
                </p>
                <button className="w-full bg-terracotta text-white font-body text-sm font-medium py-4 rounded-none hover:bg-terracotta-dark transition-colors">
                  Siparişi Tamamla
                </button>
                <div className="flex justify-between">
                  <button onClick={closeCart} className="font-body text-xs text-terracotta hover:text-terracotta-dark">
                    Alışverişe Devam
                  </button>
                  <button onClick={clearCart} className="font-body text-xs text-brown-mid/50 hover:text-red-500">
                    Sepeti Temizle
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

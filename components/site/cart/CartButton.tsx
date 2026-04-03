"use client";

import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartButton() {
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={openCart}
      className="relative w-9 h-9 flex items-center justify-center text-brown-deep hover:text-terracotta transition-colors"
      aria-label="Sepet"
    >
      <ShoppingBag size={18} />
      {mounted && totalItems > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-white text-[10px] font-body rounded-full flex items-center justify-center">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

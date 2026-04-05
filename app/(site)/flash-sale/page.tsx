"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Zap, Clock, ShoppingBag } from "lucide-react";

interface FlashProduct {
  id: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  discountValue: string;
  maxQuantity: number | null;
  soldCount: number;
  product: {
    id: string;
    name: string;
    slug: string;
    shortDesc: string;
    basePrice: string;
    stockCount: number | null;
    images: { url: string; altText: string | null }[];
  };
}

interface FlashSaleData {
  flashSale: {
    id: string;
    name: string;
    products: FlashProduct[];
  } | null;
  endsAt: string | null;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function calcDiscountedPrice(
  basePrice: number,
  discountType: string,
  discountValue: number
): number {
  if (discountType === "PERCENTAGE") {
    return basePrice * (1 - discountValue / 100);
  }
  if (discountType === "FIXED_AMOUNT") {
    return Math.max(0, basePrice - discountValue);
  }
  return basePrice;
}

function calcDiscountPercent(
  basePrice: number,
  discountType: string,
  discountValue: number
): number {
  if (discountType === "PERCENTAGE") {
    return Math.round(discountValue);
  }
  if (discountType === "FIXED_AMOUNT" && basePrice > 0) {
    return Math.round((discountValue / basePrice) * 100);
  }
  return 0;
}

function FlashSaleContent() {
  const router = useRouter();
  const [data, setData] = useState<FlashSaleData | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSale() {
      try {
        const res = await fetch("/api/flash-sales/active");
        const json: FlashSaleData = await res.json();

        if (!json.flashSale || !json.endsAt) {
          router.replace("/menu");
          return;
        }

        const diff = Math.floor(
          (new Date(json.endsAt).getTime() - Date.now()) / 1000
        );
        if (diff <= 0) {
          router.replace("/menu");
          return;
        }

        setData(json);
        setRemaining(diff);
      } catch {
        router.replace("/menu");
      } finally {
        setLoading(false);
      }
    }
    fetchSale();
  }, [router]);

  // Countdown
  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          router.replace("/menu");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C4622D]" />
      </div>
    );
  }

  if (!data?.flashSale) return null;

  const { flashSale } = data;

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      {/* Banner */}
      <div
        className="py-8 px-4 text-white text-center"
        style={{
          background: "linear-gradient(135deg, #C4622D 0%, #8B3E18 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider mb-4">
            <Zap className="w-4 h-4 fill-current" />
            Flash Sale
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {flashSale.name}
          </h1>
          <div className="inline-flex items-center gap-2 bg-black/20 rounded-lg px-5 py-2">
            <Clock className="w-5 h-5" />
            <span className="font-mono text-2xl font-bold">
              {formatTime(remaining)}
            </span>
            <span className="text-sm opacity-80">kaldi</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {flashSale.products.map((fp) => {
            const basePrice = Number(fp.product.basePrice);
            const discountValue = Number(fp.discountValue);
            const discountedPrice = calcDiscountedPrice(
              basePrice,
              fp.discountType,
              discountValue
            );
            const discountPercent = calcDiscountPercent(
              basePrice,
              fp.discountType,
              discountValue
            );
            const imageUrl = fp.product.images[0]?.url || "/placeholder.jpg";
            const remaining =
              fp.maxQuantity !== null
                ? fp.maxQuantity - fp.soldCount
                : null;
            const stockPercent =
              fp.maxQuantity && fp.maxQuantity > 0
                ? (fp.soldCount / fp.maxQuantity) * 100
                : 0;

            return (
              <Link
                key={fp.id}
                href={`/urun/${fp.product.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-[#F5DCC8]/50"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={fp.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Discount badge */}
                  {discountPercent > 0 && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      %{discountPercent} indirim
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-[#3D1A0A] mb-1 line-clamp-2">
                    {fp.product.name}
                  </h3>
                  <p className="text-sm text-[#6B3520]/60 mb-3 line-clamp-1">
                    {fp.product.shortDesc}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-red-600">
                      {discountedPrice.toFixed(2)} TL
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {basePrice.toFixed(2)} TL
                    </span>
                  </div>

                  {/* Stock bar */}
                  {fp.maxQuantity && fp.maxQuantity > 0 && (
                    <div className="space-y-1">
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(stockPercent, 100)}%`,
                            background:
                              stockPercent > 80
                                ? "#ef4444"
                                : stockPercent > 50
                                  ? "#f59e0b"
                                  : "#C4622D",
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {fp.soldCount} / {fp.maxQuantity} satildi
                        </span>
                        {remaining !== null && remaining > 0 && remaining < 5 && (
                          <span className="text-red-600 font-semibold flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" />
                            {remaining} kaldi!
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {flashSale.products.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">Bu kampanyada henuz urun yok.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlashSalePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C4622D]" />
        </div>
      }
    >
      <FlashSaleContent />
    </Suspense>
  );
}

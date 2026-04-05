"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

interface FlashSaleData {
  flashSale: { id: string; name: string } | null;
  endsAt: string | null;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function FlashSaleBar() {
  const [data, setData] = useState<FlashSaleData | null>(null);
  const [remaining, setRemaining] = useState<number>(0);
  const [visible, setVisible] = useState(false);

  // Fetch active flash sale on mount
  useEffect(() => {
    async function fetchFlashSale() {
      try {
        const res = await fetch("/api/flash-sales/active");
        const json: FlashSaleData = await res.json();
        if (json.flashSale && json.endsAt) {
          const diff = Math.floor(
            (new Date(json.endsAt).getTime() - Date.now()) / 1000
          );
          if (diff > 0) {
            setData(json);
            setRemaining(diff);
            setVisible(true);
          }
        }
      } catch {
        // Silently fail — no flash sale bar
      }
    }
    fetchFlashSale();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!visible || remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, remaining]);

  if (!visible || !data?.flashSale) return null;

  return (
    <div
      className="w-full py-2.5 px-4 text-white text-sm"
      style={{
        background: "linear-gradient(90deg, #C4622D 0%, #8B3E18 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
        {/* Flash Sale Badge */}
        <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-current" />
          Flash Sale
        </span>

        {/* Sale name */}
        <span className="font-medium">{data.flashSale.name}</span>

        {/* Countdown */}
        <span className="font-mono font-bold text-base bg-black/20 rounded px-2 py-0.5">
          {formatTime(remaining)}
        </span>

        {/* CTA */}
        <Link
          href="/flash-sale"
          className="inline-flex items-center gap-1 bg-white text-[#8B3E18] font-semibold text-xs rounded-full px-4 py-1 hover:bg-white/90 transition-colors"
        >
          Urunleri Gor &rarr;
        </Link>
      </div>
    </div>
  );
}

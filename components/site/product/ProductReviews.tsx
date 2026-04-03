"use client";

import { Star } from "lucide-react";

const mockReviews = [
  { name: "Ayşe K.", initials: "AK", rating: 5, date: "15 Ekim 2024", occasion: "Misafir Ağırlama", text: "Her şey mükemmeldi. Sunum muhteşem, lezzet üst düzey. Misafirlerim hayran kaldı." },
  { name: "Mehmet B.", initials: "MB", rating: 5, date: "8 Ekim 2024", occasion: "İş Yemeği", text: "Kurumsal toplantımız için sipariş verdik. Profesyonel sunum ve harika lezzet." },
  { name: "Zeynep A.", initials: "ZA", rating: 4, date: "22 Eylül 2024", occasion: "Doğum Günü", text: "Çok lezzetliydi. Teslimat biraz geç oldu ama ürün kalitesi fark yarattı." },
];

export default function ProductReviews({ avgRating, reviewCount }: { avgRating: number; reviewCount: number }) {
  return (
    <div id="reviews" className="mt-16 max-w-4xl">
      <div className="flex items-start gap-8 mb-10">
        <div className="text-center">
          <p className="font-heading text-6xl font-bold text-terracotta">{avgRating}</p>
          <div className="flex gap-0.5 justify-center mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className={i < Math.floor(avgRating) ? "text-gold fill-gold" : "text-gold/30"} />
            ))}
          </div>
          <p className="font-body text-xs text-brown-mid mt-1">{reviewCount} değerlendirme</p>
        </div>

        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = star === 5 ? 73 : star === 4 ? 20 : star === 3 ? 5 : 2;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="font-body text-xs text-brown-mid w-4">{star}★</span>
                <div className="flex-1 h-2 bg-gold-light rounded-full overflow-hidden">
                  <div className="h-full bg-terracotta rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="font-body text-xs text-brown-mid w-8">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-0">
        {mockReviews.map((review, i) => (
          <div key={i} className="py-6 border-b border-gold-light">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center">
                <span className="font-body text-xs font-medium text-terracotta">{review.initials}</span>
              </div>
              <div>
                <p className="font-body text-sm text-brown-deep font-medium">{review.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={12} className={j < review.rating ? "text-gold fill-gold" : "text-gold/30"} />
                    ))}
                  </div>
                  <span className="font-body text-[10px] text-brown-mid">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="font-body text-sm text-brown-deep leading-relaxed">{review.text}</p>
            <span className="inline-block mt-2 font-body text-[10px] bg-cream text-gold px-2 py-0.5">{review.occasion}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

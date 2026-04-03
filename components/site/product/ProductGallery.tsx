"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SafeImage from "@/components/site/ui/SafeImage";

export default function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const allImages = images.length > 0 ? images : [""];
  const current = allImages[activeIndex] ?? "";

  return (
    <>
      <div className="flex gap-3">
        {/* Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex flex-col gap-2 w-16 shrink-0">
            {allImages.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-16 h-16 border-2 overflow-hidden ${activeIndex === i ? "border-terracotta" : "border-gold-light"}`}
              >
                <SafeImage src={img} alt={`${productName} ${i + 1}`} aspectRatio="aspect-square" fallbackLabel="" />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <button onClick={() => setLightbox(true)} className="flex-1 cursor-zoom-in">
          <SafeImage
            src={current}
            alt={productName}
            aspectRatio="aspect-square"
            fallbackLabel={productName}
            className="w-full"
          />
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)} className="absolute top-6 right-6 text-white hover:text-gold" aria-label="Kapat">
            <X size={28} />
          </button>
          {allImages.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setActiveIndex((p) => (p - 1 + allImages.length) % allImages.length); }} className="absolute left-4 text-white hover:text-gold" aria-label="Önceki">
                <ChevronLeft size={36} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setActiveIndex((p) => (p + 1) % allImages.length); }} className="absolute right-4 text-white hover:text-gold" aria-label="Sonraki">
                <ChevronRight size={36} />
              </button>
            </>
          )}
          <div className="max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <SafeImage src={current} alt={productName} aspectRatio="aspect-square" fallbackLabel={productName} className="w-full" />
          </div>
        </div>
      )}
    </>
  );
}

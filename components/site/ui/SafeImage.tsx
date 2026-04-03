"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackLabel?: string;
}

export default function SafeImage({
  src,
  alt,
  aspectRatio = "aspect-square",
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  fallbackLabel,
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const hasImage = src && src.length > 0 && !error;

  if (!hasImage) {
    return (
      <div
        className={`relative ${aspectRatio} ${className}`}
        style={{ background: "linear-gradient(135deg, #E8D5A3, #F5DCC8)" }}
      >
        {fallbackLabel && (
          <span className="absolute inset-0 flex items-center justify-center font-heading text-lg italic text-gold px-4 text-center">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${aspectRatio} ${className} overflow-hidden`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
        onError={() => setError(true)}
      />
    </div>
  );
}

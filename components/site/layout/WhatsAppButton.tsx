"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://wa.me/905XXXXXXXXX"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle size={26} className="text-white" fill="white" />
      </div>
      {hovered && (
        <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-brown-deep text-white font-body text-xs px-3 py-1.5 rounded shadow-md">
          Sipariş danışmanı
        </span>
      )}
    </a>
  );
}

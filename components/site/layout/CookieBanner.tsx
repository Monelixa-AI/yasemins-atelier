"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem("cookie-consent", accepted ? "accepted" : "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brown-deep/95 backdrop-blur-sm border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-body text-sm text-white/80 text-center sm:text-left">
          Deneyiminizi iyileştirmek için çerezler kullanıyoruz. KVKK kapsamında
          kişisel verileriniz korunmaktadır.{" "}
          <a
            href="/cerez-politikasi"
            className="text-gold underline underline-offset-2 hover:text-gold-light"
          >
            Çerez Politikası
          </a>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleConsent(false)}
            className="font-body text-xs text-white/60 hover:text-white px-4 py-2 border border-white/20 rounded-none transition-colors"
          >
            Reddet
          </button>
          <button
            onClick={() => handleConsent(true)}
            className="font-body text-xs text-white bg-terracotta hover:bg-terracotta-dark px-4 py-2 rounded-none transition-colors"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}

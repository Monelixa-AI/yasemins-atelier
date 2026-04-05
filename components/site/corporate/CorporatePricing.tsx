"use client";

import Link from "next/link";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  discount: string;
  users: string;
  features: string[];
  badge?: string;
  bg: string;
  text: string;
  accent: string;
  btn: string;
  btnText: string;
}

const plans: Plan[] = [
  {
    name: "Başlangıç",
    discount: "%5 indirim",
    users: "2 kullanıcı",
    features: [
      "Aylık fatura",
      "Sipariş şablonları",
      "E-posta desteği",
      "Temel raporlama",
    ],
    bg: "bg-white border border-[#B8975C]/15",
    text: "text-[#3D1A0A]",
    accent: "text-[#C4622D]",
    btn: "bg-[#3D1A0A] hover:bg-[#3D1A0A]/90 text-white",
    btnText: "Başvuru Yap",
  },
  {
    name: "İş Ortağı",
    discount: "%10–15 indirim",
    users: "5 kullanıcı",
    badge: "En Çok Tercih Edilen",
    features: [
      "Net 30 vade",
      "Öncelikli teslimat",
      "Özel müşteri temsilcisi",
      "Markalı ambalaj seçenekleri",
      "Detaylı analitik raporlar",
    ],
    bg: "bg-[#3D1A0A]",
    text: "text-white",
    accent: "text-[#B8975C]",
    btn: "bg-[#C4622D] hover:bg-[#C4622D]/90 text-white",
    btnText: "Başvuru Yap",
  },
  {
    name: "Kurumsal",
    discount: "Özel fiyatlandırma",
    users: "Sınırsız kullanıcı",
    features: [
      "Net 60 vade",
      "Özel hesap yöneticisi",
      "API erişimi",
      "Onay iş akışları",
      "Özel menü tasarımı",
      "7/24 öncelikli destek",
    ],
    bg: "bg-[#C4622D]",
    text: "text-white",
    accent: "text-white/80",
    btn: "bg-white hover:bg-white/90 text-[#C4622D]",
    btnText: "İletişime Geçin",
  },
];

export default function CorporatePricing() {
  return (
    <section id="pricing" className="bg-[#FDF6EE] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C4622D]/10 text-[#C4622D] text-xs font-semibold tracking-widest uppercase mb-4">
            Fiyatlandırma
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-[#3D1A0A] mb-4">
            İhtiyacınıza uygun plan
          </h2>
          <p className="font-body text-[#3D1A0A]/60 max-w-2xl mx-auto">
            Küçük ekiplerden büyük kurumlara, her ölçeğe uygun kurumsal
            çözümler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-8 ${p.bg} ${
                p.badge ? "ring-2 ring-[#B8975C] md:-mt-4 md:mb-[-16px]" : ""
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#B8975C] text-white text-xs font-semibold whitespace-nowrap">
                  {p.badge}
                </span>
              )}

              <h3 className={`font-heading text-xl ${p.text} mb-1`}>
                {p.name}
              </h3>
              <p className={`font-heading text-3xl ${p.accent} mb-1`}>
                {p.discount}
              </p>
              <p className={`font-body text-sm ${p.text} opacity-60 mb-6`}>
                {p.users}
              </p>

              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2 font-body text-sm ${p.text} opacity-80`}
                  >
                    <Check size={16} className="flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/kurumsal/basvuru"
                className={`block text-center px-6 py-3 rounded-lg font-body font-medium text-sm transition-colors ${p.btn}`}
              >
                {p.btnText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

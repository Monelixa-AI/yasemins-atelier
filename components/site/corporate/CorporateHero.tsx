"use client";

import Link from "next/link";
import {
  BadgePercent,
  FileText,
  LayoutTemplate,
  Users,
  TrendingUp,
  ShoppingBag,
  Star,
} from "lucide-react";

const features = [
  { icon: BadgePercent, text: "Kademe bazlı özel fiyatlandırma" },
  { icon: FileText, text: "Otomatik kurumsal fatura kesimi" },
  { icon: LayoutTemplate, text: "Sipariş şablonları ile hızlı tekrar" },
  { icon: Users, text: "Çoklu kullanıcı ve onay akışı" },
];

const metrics = [
  { icon: TrendingUp, label: "Aylık Tasarruf", value: "%15'e kadar" },
  { icon: ShoppingBag, label: "Aktif Kurumsal", value: "120+" },
  { icon: Star, label: "Memnuniyet", value: "4.9/5" },
];

export default function CorporateHero() {
  return (
    <section className="bg-[#3D1A0A] min-h-[70vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
        {/* Left Column */}
        <div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#B8975C]/20 text-[#B8975C] text-xs font-semibold tracking-widest uppercase mb-6">
            Kurumsal Çözümler
          </span>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            İş dünyasına layık
            <br />
            <span className="text-[#B8975C]">gastronomi deneyimi.</span>
          </h1>

          <p className="text-white/70 font-body text-lg mb-8 max-w-lg">
            Kurumsal etkinlikleriniz, iş yemekleriniz ve hediye
            ihtiyaçlarınız için özel fiyatlandırma, fatura çözümleri ve
            kişiselleştirilmiş hizmet.
          </p>

          <ul className="space-y-3 mb-10">
            {features.map((f) => (
              <li key={f.text} className="flex items-center gap-3 text-white/80 font-body text-sm">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#B8975C]/15 flex items-center justify-center">
                  <f.icon size={16} className="text-[#B8975C]" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/kurumsal/basvuru"
              className="inline-flex items-center px-6 py-3 bg-[#C4622D] hover:bg-[#C4622D]/90 text-white font-body font-medium text-sm rounded-lg transition-colors"
            >
              Kurumsal Başvuru Yap
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center px-6 py-3 border border-white/20 hover:border-white/40 text-white font-body font-medium text-sm rounded-lg transition-colors"
            >
              Fiyatlandırmayı İncele
            </Link>
          </div>
        </div>

        {/* Right Column — Placeholder image + floating cards */}
        <div className="relative hidden lg:block">
          <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#B8975C]/20 to-[#C4622D]/20 border border-white/10 flex items-center justify-center">
            <span className="text-white/30 font-body text-sm">
              Kurumsal Görsel Alanı
            </span>
          </div>

          {/* Floating metric cards */}
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className={`absolute bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 ${
                i === 0
                  ? "-top-4 -right-4"
                  : i === 1
                  ? "bottom-8 -left-6"
                  : "bottom-0 right-8"
              }`}
            >
              <div className="flex items-center gap-2">
                <m.icon size={14} className="text-[#B8975C]" />
                <span className="text-white/60 text-xs font-body">{m.label}</span>
              </div>
              <p className="text-white font-heading text-lg mt-0.5">{m.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

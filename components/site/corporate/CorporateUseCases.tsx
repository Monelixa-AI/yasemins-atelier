"use client";

import { Utensils, Gift, Coffee, PartyPopper } from "lucide-react";

const useCases = [
  {
    icon: Utensils,
    title: "İş Yemekleri",
    description:
      "Önemli toplantılar ve müşteri ağırlamalar için sofistike menüler. Şef seçimi ile özel menü hazırlama.",
    image: "/images/corporate/business-lunch.jpg",
  },
  {
    icon: Gift,
    title: "Kurumsal Hediye",
    description:
      "Bayram, yılbaşı ve özel günlerde çalışan ve müşterilerinize unutulmaz hediye paketleri.",
    image: "/images/corporate/corporate-gift.jpg",
  },
  {
    icon: Coffee,
    title: "Ofis İkramları",
    description:
      "Günlük ofis ikramlarından workshop cateringine, ekibinizin enerjisini yüksek tutun.",
    image: "/images/corporate/office-catering.jpg",
  },
  {
    icon: PartyPopper,
    title: "Etkinlik & Lansman",
    description:
      "Ürün lansmanları, gala geceleri ve kurumsal kutlamalar için eksiksiz gastronomi hizmeti.",
    image: "/images/corporate/event.jpg",
  },
];

export default function CorporateUseCases() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-[#B8975C]/10 text-[#B8975C] text-xs font-semibold tracking-widest uppercase mb-4">
            Kullanım Alanları
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-[#3D1A0A] mb-4">
            Her ihtiyaca uygun çözümler
          </h2>
          <p className="font-body text-[#3D1A0A]/60 max-w-2xl mx-auto">
            Kurumsal dünyada gastronominin gücünü keşfedin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="group relative overflow-hidden rounded-2xl border border-[#B8975C]/10 hover:border-[#B8975C]/30 transition-all"
            >
              {/* Placeholder image area */}
              <div className="aspect-[16/9] bg-gradient-to-br from-[#FDF6EE] to-[#B8975C]/10 flex items-center justify-center">
                <uc.icon
                  size={48}
                  className="text-[#B8975C]/30 group-hover:text-[#B8975C]/50 transition-colors"
                />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <uc.icon size={18} className="text-[#C4622D]" />
                  <h3 className="font-heading text-lg text-[#3D1A0A]">
                    {uc.title}
                  </h3>
                </div>
                <p className="font-body text-sm text-[#3D1A0A]/60 leading-relaxed">
                  {uc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

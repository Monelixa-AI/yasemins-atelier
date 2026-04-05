"use client";

import {
  BadgePercent,
  FileText,
  RefreshCw,
  Users,
  Package,
  Gift,
} from "lucide-react";

const benefits = [
  {
    icon: BadgePercent,
    title: "Özel Fiyatlandırma",
    description:
      "Sipariş hacminize göre kademe bazlı indirimlerle maliyetlerinizi düşürün. %5'ten %20'ye kadar özel kurumsal fiyatlar.",
  },
  {
    icon: FileText,
    title: "Kurumsal Fatura",
    description:
      "E-fatura ve e-arşiv fatura desteği ile muhasebe süreçlerinizi kolaylaştırın. Otomatik fatura oluşturma.",
  },
  {
    icon: RefreshCw,
    title: "Tekrarlayan Siparişler",
    description:
      "Sipariş şablonları oluşturun, tek tıkla tekrar verin. Haftalık veya aylık otomatik sipariş planları.",
  },
  {
    icon: Users,
    title: "Ekip Hesabı",
    description:
      "Farklı roller ve yetki seviyeleriyle ekibinizi yönetin. Onay akışları ve harcama limitleri belirleyin.",
  },
  {
    icon: Package,
    title: "Toplu Sipariş",
    description:
      "Büyük etkinlikler ve toplantılar için toplu sipariş kolaylığı. Özel teslimat planlaması ve lojistik desteği.",
  },
  {
    icon: Gift,
    title: "Markalı Hediyeler",
    description:
      "Kurumsal kimliğinize uygun özel ambalaj ve kartlarla hediye paketleri. Müşteri ve çalışan hediye çözümleri.",
  },
];

export default function CorporateBenefits() {
  return (
    <section className="bg-[#FDF6EE] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C4622D]/10 text-[#C4622D] text-xs font-semibold tracking-widest uppercase mb-4">
            Avantajlar
          </span>
          <h2 className="font-heading text-3xl md:text-4xl text-[#3D1A0A] mb-4">
            Kurumsal hesabınızın ayrıcalıkları
          </h2>
          <p className="font-body text-[#3D1A0A]/60 max-w-2xl mx-auto">
            İş dünyasının ihtiyaçlarına özel tasarlanmış çözümlerimizle
            operasyonel verimliliğinizi artırın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="bg-white rounded-2xl p-6 border border-[#B8975C]/10 hover:border-[#B8975C]/30 hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#C4622D]/10 flex items-center justify-center mb-4 group-hover:bg-[#C4622D]/20 transition-colors">
                <b.icon size={22} className="text-[#C4622D]" />
              </div>
              <h3 className="font-heading text-lg text-[#3D1A0A] mb-2">
                {b.title}
              </h3>
              <p className="font-body text-sm text-[#3D1A0A]/60 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

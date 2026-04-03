import type { Metadata } from "next";
import { ServicesGrid } from "@/components/site/services";

export const metadata: Metadata = {
  title: "Hizmetler | Yasemin's Atelier",
  description: "Eve şef, davet organizasyonu, ofis yemeği, mutfak atölyesi ve aylık lezzet kutusu. İstanbul.",
};

export default function HizmetlerPage() {
  return (
    <>
      <section className="bg-brown-deep py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-gold" />
            <p className="font-body text-[10px] text-gold font-medium uppercase tracking-[0.2em]">
              ✦ Premium Deneyimler
            </p>
            <div className="w-8 h-px bg-gold" />
          </div>
          <h1 className="font-heading text-5xl lg:text-[60px] text-white leading-tight">
            Hizmetlerimiz
          </h1>
          <p className="font-body text-base text-white/70 mt-6 max-w-lg mx-auto">
            Ürün siparişinin ötesinde, Yasemin&apos;in kişisel dokunuşuyla premium gastronomi deneyimleri.
          </p>
        </div>
      </section>
      <ServicesGrid />
    </>
  );
}

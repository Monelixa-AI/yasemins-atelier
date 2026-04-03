import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Sipariş | Sofra Danışmanı",
  description: "Yasemin size özel menü hazırlasın veya menüden kendiniz seçin.",
};

export default function SiparisPage() {
  return (
    <>
      {/* Split screen hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
        {/* Left — Questionnaire */}
        <div className="bg-brown-deep flex flex-col items-center justify-center p-12 text-center">
          <span className="text-5xl mb-4">👩‍🍳</span>
          <h2 className="font-heading text-4xl text-white">Sofra Danışmanı</h2>
          <p className="font-body text-base text-white/70 mt-4 max-w-sm">
            Yasemin size özel menü hazırlasın. Birkaç soru cevaplayın, en uygun lezzetleri önerelim.
          </p>
          <Link href="/menu-builder" className="mt-8 inline-flex items-center justify-center font-body text-sm font-medium bg-terracotta text-white px-8 py-4 rounded-none hover:bg-terracotta-dark transition-colors">
            Danışmana Başla →
          </Link>
        </div>

        {/* Right — Direct order */}
        <div className="bg-cream flex flex-col items-center justify-center p-12 text-center">
          <span className="text-5xl mb-4">🛒</span>
          <h2 className="font-heading text-4xl text-brown-deep">Direkt Sipariş Ver</h2>
          <p className="font-body text-base text-brown-mid mt-4 max-w-sm">
            Menüden kendiniz seçin, sepetinize ekleyin ve siparişinizi tamamlayın.
          </p>
          <Link href="/menu" className="mt-8 inline-flex items-center justify-center font-body text-sm font-medium border-2 border-terracotta text-terracotta px-8 py-4 rounded-none hover:bg-terracotta hover:text-white transition-colors">
            Menüye Git →
          </Link>
        </div>
      </section>

      {/* Services band */}
      <section className="bg-terracotta py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <p className="font-body text-xs text-white/60 uppercase tracking-[0.2em] text-center mb-6">
            Özel Hizmetlerimiz
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {services.map((svc) => (
              <Link key={svc.slug} href={`/hizmetler/${svc.slug}`} className="flex flex-col items-center gap-2 p-4 hover:bg-white/10 transition-colors text-center">
                <span className="text-2xl">{svc.icon}</span>
                <span className="font-body text-xs text-white font-medium">{svc.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";

export default function OccasionCTA({ colorBg }: { colorBg: string }) {
  return (
    <section className="py-16 text-center" style={{ backgroundColor: colorBg }}>
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="font-heading text-4xl lg:text-5xl text-white">
          Sofranızı Birlikte Kuralım
        </h2>
        <p className="font-body text-base text-white/80 mt-4">
          Sipariş verin veya premium hizmetlerimizi keşfedin.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/hizmetler/eve-sef"
            className="inline-flex items-center justify-center font-body text-sm font-medium border border-white/40 text-white px-8 py-4 rounded-none hover:bg-white/10 transition-colors"
          >
            👩‍🍳 Eve Şef Hizmeti
          </Link>
          <Link
            href="/hizmetler/davet-organizasyon"
            className="inline-flex items-center justify-center font-body text-sm font-medium border border-white/40 text-white px-8 py-4 rounded-none hover:bg-white/10 transition-colors"
          >
            🎪 Davet Organizasyonu
          </Link>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center font-body text-sm font-medium bg-white px-8 py-4 rounded-none hover:bg-cream transition-colors"
            style={{ color: colorBg }}
          >
            Menüyü Keşfet
          </Link>
        </div>
      </div>
    </section>
  );
}

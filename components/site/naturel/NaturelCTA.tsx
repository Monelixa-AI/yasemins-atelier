import Link from "next/link";

export default function NaturelCTA() {
  return (
    <section className="py-16 text-center" style={{ backgroundColor: "#4A7C3F" }}>
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="font-heading text-[36px] md:text-[48px] font-semibold text-white leading-tight">
          Doğal Lezzetleri Keşfetmeye Hazır mısınız?
        </h2>
        <p className="font-body text-[15px] text-white/75 mt-4 max-w-xl mx-auto leading-relaxed">
          Tüm Naturel ürünlerinde Türkiye geneli kargo.
          750₺ üzeri siparişlerde ücretsiz teslimat.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/naturel/urunler"
            className="inline-flex items-center justify-center font-body text-sm font-medium tracking-wide px-8 py-4 transition-colors duration-300 hover:bg-gray-100"
            style={{ backgroundColor: "white", color: "#4A7C3F" }}
          >
            Tüm Ürünleri Gör
          </Link>
          <Link
            href="/urunler/naturel-hediye-kutusu"
            className="inline-flex items-center justify-center font-body text-sm font-medium tracking-wide border border-white text-white px-8 py-4 transition-colors duration-300 hover:bg-white/10"
          >
            Hediye Kutusu Al
          </Link>
        </div>
      </div>
    </section>
  );
}

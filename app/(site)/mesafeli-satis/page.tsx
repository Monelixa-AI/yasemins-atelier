import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mesafeli Satis Sozlesmesi On Bilgilendirme Formu",
  robots: { index: false, follow: false },
};

export default function MesafeliSatisPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-[#3D1A0A]">Mesafeli Satis Sozlesmesi On Bilgilendirme Formu</h1>
      <p className="mb-8 text-sm text-neutral-500">Son guncelleme: 01.01.2025</p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">1. Satici Bilgileri</h2>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          <p><strong>Unvan:</strong> Yasemin [Soyad] (Yasemin&apos;s Atelier)</p>
          <p><strong>Adres:</strong> Istanbul, Turkiye</p>
          <p><strong>E-posta:</strong> hello@yaseminsatelier.com</p>
          <p><strong>Telefon:</strong> +90 5XX XXX XX XX</p>
          <p><strong>Vergi No:</strong> XXXXXXXXXXX</p>
        </div>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">2. Urun ve Hizmetler</h2>
        <p className="leading-relaxed text-neutral-700">
          Satis konusu urun ve hizmetlerin temel nitelikleri (turu, miktari, alerjen bilgileri) siparis oncesinde urun
          detay sayfasinda acikca belirtilmektedir. Urun gorselleri temsili olup, el yapimi urunlerin dogasi geregi
          gorselden farkliliklar gosterebilir.
        </p>
        <p className="mt-2 leading-relaxed text-neutral-700">
          Sunulan urun ve hizmetler: El yapimi gida urunleri, ozel gun kutulari, catering hizmetleri, gastronomi
          workshop&apos;lari, abonelik kutulari ve kurumsal hizmetler.
        </p>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">3. Fiyat ve Odeme</h2>
        <p className="leading-relaxed text-neutral-700">
          Tum urun fiyatlari <strong>KDV dahil</strong> olarak gosterilmektedir. Teslimat ucreti siparis ozetinde ayrica
          belirtilir. Toplam odeme tutari, siparis onayindan once acikca gosterilir.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">4. Odeme Yontemleri</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">Asagidaki odeme yontemleri kabul edilmektedir:</p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>Kredi karti / Banka karti (Visa, Mastercard, Troy)</li>
          <li>Online banka havalesi / EFT</li>
          <li>Kapida nakit odeme (secili bolgelerde)</li>
        </ul>
        <p className="mt-2 text-sm text-neutral-500">
          Kredi karti bilgileri PCI DSS uyumlu odeme altyapilari (Stripe, iyzico) uzerinden islenir. Kart bilgileri
          sunucularimizda saklanmaz.
        </p>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">5. Teslimat</h2>
        <p className="leading-relaxed text-neutral-700">
          Urunler, siparis sirasinda sectiginiz tarih ve saat araliginda belirttiginiz adrese teslim edilir. Teslimat
          yalnizca Istanbul ili sinirlarinda gerceklestirilmektedir. Teslimat suresi ve ucretine iliskin detayli bilgi
          icin{" "}
          <a href="/teslimat-politikasi" className="font-medium text-[#3D1A0A] underline">
            Teslimat Politikamizi
          </a>{" "}
          inceleyebilirsiniz.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">6. Cayma Hakki</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          6502 sayili Tuketicinin Korunmasi Hakkinda Kanun uyarinca, tuketici mesafeli sozlesmenin kurulmasindan itibaren
          14 gun icinde herhangi bir gerekce gostermeksizin cayma hakkina sahiptir.
        </p>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-neutral-700">
          <p className="font-semibold">Gida Urunleri Istisnasi</p>
          <p className="mt-1">
            Mesafeli Sozlesmeler Yonetmeligi Madde 15/1-c uyarinca, niteligi itibariyle iade edilemeyecek, hizla
            bozulma veya son kullanma tarihi gecme ihtimali olan mallar cayma hakki kapsaminda degildir.
            Urunlerimizin buyuk cogunlugu gida niteligi tasidigimdan, teslim sonrasi cayma hakki uygulanamamaktadir.
          </p>
        </div>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Siparis iptali icin teslimat saatinden en az 12 saat once talepte bulunabilirsiniz. Detaylar icin{" "}
          <a href="/iptal-iade" className="font-medium text-[#3D1A0A] underline">
            Iptal ve Iade Politikamizi
          </a>{" "}
          inceleyebilirsiniz.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">7. Uyusmazlik Cozumu</h2>
        <p className="leading-relaxed text-neutral-700">
          Bu sozlesmeden dogan uyusmazliklarda, Ticaret Bakanligi tarafindan ilan edilen deger sinirinin altindaki
          uyusmazliklarda <strong>Tuketici Hakem Heyetleri</strong>, ustundeki uyusmazliklarda{" "}
          <strong>Istanbul Tuketici Mahkemeleri</strong> yetkilidir.
        </p>
        <p className="mt-2 leading-relaxed text-neutral-700">
          Tuketici, sikayetlerini Ticaret Bakanligi Tuketici Sikayetleri platformu (tuketici.ticaret.gov.tr) uzerinden
          de iletebilir. Basvurularda uygulanacak parasal sinirlar her yil Ticaret Bakanligi tarafindan belirlenir.
        </p>
      </section>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        <p>
          Bu on bilgilendirme formu, 6502 sayili Kanun ve Mesafeli Sozlesmeler Yonetmeligi uyarinca
          duzenlenmistir. Sorulariniz icin: <strong>hello@yaseminsatelier.com</strong>
        </p>
      </div>
    </main>
  );
}

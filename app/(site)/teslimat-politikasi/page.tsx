import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teslimat Politikasi",
  robots: { index: false, follow: false },
};

export default function TeslimatPolitikasiPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-[#3D1A0A]">Teslimat Politikasi</h1>
      <p className="mb-8 text-sm text-neutral-500">Son guncelleme: 01.01.2025</p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">1. Teslimat Bolgeleri</h2>
        <p className="leading-relaxed text-neutral-700">
          Yasemin&apos;s Atelier olarak su anda yalnizca <strong>Istanbul</strong> genelinde teslimat hizmeti sunmaktayiz.
          Teslimat bolgeleri ilce bazinda tanimlanmis olup, siparis sirasinda adresinizin teslimat bolgesi icinde olup
          olmadigini kontrol edebilirsiniz. Istanbul disi teslimat talepleriniz icin bizimle iletisime gecebilirsiniz.
        </p>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">2. Teslimat Ucretleri</h2>
        <p className="leading-relaxed text-neutral-700">
          Teslimat ucretleri, teslimat bolgesine ve siparis tutarina gore degisiklik gosterir. Siparis ozetinde teslimat
          ucreti acikca belirtilir. Belirli tutarin uzerindeki siparislerde ucretsiz teslimat kampanyalari
          uygulanabilir. Kampanya detaylari icin web sitemizi takip edebilirsiniz.
        </p>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">3. Teslimat Suresi</h2>
        <p className="leading-relaxed text-neutral-700">
          Siparisler, sectiginiz teslimat tarihinde adresinize ulastirilir. Teslimat planlamamiz icin onemli bilgiler:
        </p>
        <ul className="ml-5 mt-2 list-disc space-y-1 text-neutral-700">
          <li>
            <strong>Saat 14:00&apos;a kadar</strong> verilen siparisler, ertesi gun (veya secilen tarihte) teslim edilir
          </li>
          <li>Saat 14:00 sonrasi verilen siparisler bir sonraki uygun teslimat gunune planlanir</li>
          <li>Ozel gun ve bayram donemlerinde teslimat suresi uzayabilir</li>
        </ul>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">4. Teslimat Saatleri</h2>
        <p className="leading-relaxed text-neutral-700">
          Teslimatlar asagidaki saatler arasinda gerceklestirilir:
        </p>
        <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-neutral-700">
          <p><strong>Teslimat Saatleri:</strong> 10:00 - 21:00</p>
          <p><strong>Teslimat Gunleri:</strong> Sali - Pazar</p>
          <p className="mt-2 text-sm text-neutral-500">
            Pazartesi gunleri teslimat yapilmamaktadir. Siparis sirasinda uygun teslimat saatini secebilirsiniz.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">5. Teslimat Degisiklikleri</h2>
        <p className="leading-relaxed text-neutral-700">
          Teslimat adresinizi veya tarihinizi, planlanan teslimat saatinden en az <strong>12 saat once</strong>{" "}
          degistirebilirsiniz. Degisiklik taleplerinizi hesabinizdaki siparis detay sayfasindan veya
          hello@yaseminsatelier.com adresine e-posta gondererek iletebilirsiniz. 12 saatten kisa surede yapilan
          degisiklik talepleri, urun hazirligina baslanmis olabileceginden karsilanamayabilir.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">6. Basarisiz Teslimat</h2>
        <p className="leading-relaxed text-neutral-700">
          Teslimat adresinde kimsenin bulunmamasi veya yanlis adres bilgisi nedeniyle teslimat gerceklestirilemezse:
        </p>
        <ul className="ml-5 mt-2 list-disc space-y-1 text-neutral-700">
          <li>Kuryemiz sizi telefon ile arayacaktir</li>
          <li>Ulasim saglanamaz ise siparis depoya geri getirilir</li>
          <li>Yeniden teslimat icin ek teslimat ucreti uygulanabilir</li>
          <li>Gida urunlerinin niteligi geregi, teslimat gunu icinde teslim edilemeyen siparisler imha edilebilir</li>
        </ul>
        <p className="mt-2 leading-relaxed text-neutral-700">
          Bu durumda iade veya yeniden gonderim icin musteri hizmetlerimizle iletisime gecmenizi oneririz.
        </p>
      </section>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        <p>
          Sorulariniz icin: <strong>hello@yaseminsatelier.com</strong> | Telefon: +90 5XX XXX XX XX
        </p>
      </div>
    </main>
  );
}

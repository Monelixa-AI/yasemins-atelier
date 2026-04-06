import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanim Kosullari",
  robots: { index: false, follow: false },
};

export default function KullanimKosullariPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-[#3D1A0A]">Kullanim Kosullari</h1>
      <p className="mb-8 text-sm text-neutral-500">Son guncelleme: 01.01.2025</p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">1. Genel Hukumler</h2>
        <p className="leading-relaxed text-neutral-700">
          Bu kullanim kosullari, yaseminsatelier.com web sitesini (&quot;Site&quot;) kullanan tum ziyaretciler ve uyeler icin
          gecerlidir. Siteyi kullanarak bu kosullari kabul etmis sayilirsiniz. Yasemin&apos;s Atelier, bu kosullari onceden
          bildirimde bulunmaksizin guncelleme hakkini sakli tutar. Guncel kosullar her zaman bu sayfada yayinlanir.
        </p>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">2. Kullanim Kurallari</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">Siteyi kullanirken asagidaki kurallara uymaniz gerekmektedir:</p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>Site icerigini yalnizca kisisel ve ticari olmayan amaclarla kullanabilirsiniz</li>
          <li>Sahte bilgilerle hesap olusturmak yasaktir</li>
          <li>Site altyapisina zarar verecek faaliyetlerde bulunmak yasaktir</li>
          <li>Otomatik veri toplama araclari (bot, scraper vb.) kullanmak yasaktir</li>
          <li>Baska kullanicilarin hesaplarina yetkisiz erisim saglamak yasaktir</li>
          <li>Sahte siparis vermek veya sistemi kotüye kullanmak yasaktir</li>
        </ul>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">3. Fikri Mulkiyet Haklari</h2>
        <p className="leading-relaxed text-neutral-700">
          Site uzerindeki tum icerikler (metinler, gorseller, logolar, tasarimlar, tarifler, videolar ve yazilim) Yasemin&apos;s
          Atelier&apos;in mulkiyetindedir veya lisanslidir. Bu iceriklerin izinsiz kopyalanmasi, dagitilmasi, degistirilmesi
          veya ticari amacla kullanilmasi 5846 sayili Fikir ve Sanat Eserleri Kanunu kapsaminda yasaktir.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">4. Sorumluluk Sinirlamasi</h2>
        <p className="leading-relaxed text-neutral-700">
          Yasemin&apos;s Atelier, site uzerinden sunulan bilgilerin dogrulugu icin azami ozeni gostermekle birlikte, hata veya
          eksikliklerden kaynaklanan zararlardan sorumluluk kabul etmez. Site &quot;oldugu gibi&quot; sunulmakta olup, herhangi bir
          garanti verilmemektedir. Urunlere iliskin gorseller temsilidir; gercek urunler gorsellerden farklilik
          gosterebilir.
        </p>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">5. Urun Bilgileri</h2>
        <p className="leading-relaxed text-neutral-700">
          Sitede yer alan urun bilgileri, fiyatlar ve stok durumlari onceden bildirim yapilmaksizin degistirilebilir.
          Fiyatlar KDV dahildir. Alerjen bilgileri urun sayfalarinda belirtilmektedir; ancak uretim ortamimizda cesitli
          alerjenler islendiginden, alerji durumlilugu olan musterilerimizin siparis oncesi bizimle iletisime gecmesini
          oneririz.
        </p>
      </section>

      {/* 6 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">6. Hizmet Kesintileri</h2>
        <p className="leading-relaxed text-neutral-700">
          Yasemin&apos;s Atelier, bakim, guncelleme veya teknik sorunlar nedeniyle siteyi gecici olarak askiya alabilir veya
          erisimi sinirlandirabilir. Planlanan bakimlar icin onceden bilgilendirme yapilmaya calisilacaktir. Hizmet
          kesintilerinden kaynaklanan siparis gecikmeleri durumunda musteriler bilgilendirilecektir.
        </p>
      </section>

      {/* 7 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">7. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
        <p className="leading-relaxed text-neutral-700">
          Bu kullanim kosullari Turk Hukukuna tabidir. Bu kosullardan dogan her turlu uyusmazlikta Istanbul Mahkemeleri
          ve Icra Daireleri yetkilidir. Tuketicilerin ikamet ettikleri yerdeki tuketici hakem heyetlerine ve tuketici
          mahkemelerine basvuru haklari saklidir.
        </p>
      </section>

      {/* 8 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">8. Iletisim</h2>
        <p className="leading-relaxed text-neutral-700">
          Kullanim kosullarina iliskin soru ve onerileriniz icin asagidaki kanallardan bize ulasabilirsiniz:
        </p>
        <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          <p><strong>E-posta:</strong> hello@yaseminsatelier.com</p>
          <p><strong>Telefon:</strong> +90 5XX XXX XX XX</p>
          <p><strong>Adres:</strong> Istanbul, Turkiye</p>
        </div>
      </section>
    </main>
  );
}

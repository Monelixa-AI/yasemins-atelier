import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikasi",
  robots: { index: false, follow: false },
};

export default function GizlilikPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-[#3D1A0A]">Gizlilik Politikasi</h1>
      <p className="mb-8 text-sm text-neutral-500">Son guncelleme: 01.01.2025</p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">1. Veri Sorumlusu</h2>
        <p className="leading-relaxed text-neutral-700">
          Bu gizlilik politikasi, Yasemin&apos;s Atelier (&quot;Sirket&quot;) tarafindan isletilen yaseminsatelier.com web sitesi ve
          mobil uygulamalar araciligiyla toplanan kisisel verilerin korunmasina iliskin esaslari duzenler. Veri sorumlusu
          sifatiyla Yasemin [Soyad], Istanbul, Turkiye adresinde faaliyet gostermektedir. Iletisim: kvkk@yaseminsatelier.com
        </p>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">2. Toplanan Veri Turleri</h2>
        <ul className="ml-5 list-disc space-y-2 text-neutral-700">
          <li><strong>Kimlik Verileri:</strong> Ad, soyad, dogum tarihi.</li>
          <li><strong>Iletisim Verileri:</strong> E-posta adresi, telefon numarasi, teslimat adresi.</li>
          <li><strong>Odeme Verileri:</strong> Kredi/banka karti bilgileri (Stripe/iyzico altyapisi uzerinden; kart bilgileri sunucularimizda saklanmaz).</li>
          <li><strong>Davranissal Veriler:</strong> Siparis gecmisi, favori urunler, site icindeki etkilesimler, arama gecmisi.</li>
          <li><strong>Teknik Veriler:</strong> IP adresi, tarayici turu, isletim sistemi, cerez verileri, ziyaret suresi.</li>
        </ul>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">3. Veri Isleme Amaclari</h2>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>Siparis ve teslimat sureclerinin yurutulmesi</li>
          <li>Odeme islemlerinin gerceklestirilmesi</li>
          <li>Musteri hizmetleri ve destek saglanmasi</li>
          <li>Pazarlama ve kampanya bildirimlerinin gonderilmesi (onay dahilinde)</li>
          <li>Yasal yukumluluklerin yerine getirilmesi (fatura, vergi vb.)</li>
          <li>Site guvenliginin saglanmasi ve dolandiricilik onlenmesi</li>
          <li>Urun ve hizmet kalitesinin iyilestirilmesi</li>
        </ul>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">4. Hukuki Dayanak</h2>
        <p className="leading-relaxed text-neutral-700">
          Kisisel verileriniz, 6698 sayili Kisisel Verilerin Korunmasi Kanunu (KVKK) Madde 5&apos;te belirtilen asagidaki
          hukuki sebeplere dayanilarak islenmektedir:
        </p>
        <ul className="ml-5 mt-2 list-disc space-y-1 text-neutral-700">
          <li>Bir sozlesmenin kurulmasi veya ifasiyla dogrudan ilgili olmasi (siparis isleme)</li>
          <li>Veri sorumlusunun hukuki yukumlulugu (vergi mevzuati, tuketici hukuku)</li>
          <li>Ilgili kisinin temel hak ve ozgurluklerine zarar vermemek kaydiyla mesru menfaat</li>
          <li>Acik riza (pazarlama iletisimleri, cerezler)</li>
        </ul>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">5. Veri Paylasimi</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          Kisisel verileriniz asagidaki ucuncu taraflarla, yalnizca belirtilen amaclar dogrultusunda paylasilabilir:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li><strong>Kargo/Kurye Firmalari:</strong> Teslimat adresiniz ve iletisim bilgileriniz</li>
          <li><strong>Stripe &amp; iyzico:</strong> Odeme islemleri icin odeme verileri</li>
          <li><strong>Resend:</strong> E-posta bildirim hizmeti</li>
          <li><strong>Netgsm:</strong> SMS bildirim hizmeti</li>
          <li><strong>Google Analytics:</strong> Anonim site kullanim istatistikleri</li>
        </ul>
      </section>

      {/* 6 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">6. Saklama Sureleri</h2>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>Hesap bilgileri: Hesap aktif oldugu surece + hesap kapatmadan sonra 1 yil</li>
          <li>Siparis ve fatura verileri: 10 yil (Vergi Usul Kanunu)</li>
          <li>Pazarlama rizalari: Riza geri cekilene kadar</li>
          <li>Cerez verileri: Cerez turune gore 30 gun - 2 yil</li>
          <li>Destek talepleri: 3 yil</li>
        </ul>
      </section>

      {/* 7 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">7. Haklariniz (KVKK Madde 11)</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          KVKK Madde 11 uyarinca asagidaki haklara sahipsiniz:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>Kisisel verilerinizin islenip islenmedigini ogrenme</li>
          <li>Islenmisse buna iliskin bilgi talep etme</li>
          <li>Isleme amacini ve amacina uygun kullanilip kullanilmadigini ogrenme</li>
          <li>Yurt icinde veya yurt disinda aktarildiyi ucuncu kisileri bilme</li>
          <li>Eksik veya yanlis islenmisse duzeltilmesini isteme</li>
          <li>KVKK Madde 7 kosullari cercevesinde silinmesini veya yok edilmesini isteme</li>
          <li>Islenen verilerin analiz edilmesiyle aleyhinize bir sonucun ortaya cikmasina itiraz etme</li>
          <li>Kanuna aykiri islenmesi sebebiyle zarara ugramaniz halinde zararin giderilmesini talep etme</li>
        </ul>
        <p className="mt-2 text-neutral-700">
          Basvurularinizi <strong>kvkk@yaseminsatelier.com</strong> adresine iletebilirsiniz. Talepleriniz en gec 30 gun icinde
          ucretsiz olarak yanitlanacaktir.
        </p>
      </section>

      {/* 8 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">8. Guvenlik Onlemleri</h2>
        <p className="leading-relaxed text-neutral-700">
          Kisisel verilerinizin guvenligini saglamak icin SSL/TLS sifreleme, guvenlik duvari, erisim kontrol mekanizmalari
          ve duzenli guvenlik denetimleri uygulanmaktadir. Odeme bilgileri PCI DSS uyumlu altyapilar (Stripe, iyzico)
          uzerinden islenmekte olup kart bilgileri sunucularimizda saklanmamaktadir.
        </p>
      </section>

      {/* 9 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">9. Cocuklarin Gizliligi</h2>
        <p className="leading-relaxed text-neutral-700">
          Hizmetlerimiz 18 yas alti bireylere yonelik degildir. Bilerek 18 yasindan kucuk kisilerden kisisel veri
          toplamamaktayiz. Boyle bir durumun tespit edilmesi halinde ilgili veriler derhal silinecektir.
        </p>
      </section>

      {/* 10 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">10. Degisiklikler</h2>
        <p className="leading-relaxed text-neutral-700">
          Bu gizlilik politikasi gerektiginde guncellenebilir. Onemli degisikliklerde web sitemiz uzerinden bilgilendirme
          yapilacak ve guncel versiyon bu sayfada yayinlanacaktir. Politikayi duzenli olarak kontrol etmenizi oneririz.
        </p>
      </section>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        <p>
          Sorulariniz icin: <strong>kvkk@yaseminsatelier.com</strong> | Yasemin&apos;s Atelier, Istanbul, Turkiye
        </p>
      </div>
    </main>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KVKK Aydinlatma Metni",
  robots: { index: false, follow: false },
};

export default function KvkkPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-[#3D1A0A]">KVKK Aydinlatma Metni</h1>
      <p className="mb-8 text-sm text-neutral-500">
        6698 Sayili Kisisel Verilerin Korunmasi Kanunu Madde 10 Uyarinca Aydinlatma Yukumlulugu
      </p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">1. Veri Sorumlusunun Kimligi</h2>
        <p className="leading-relaxed text-neutral-700">
          6698 sayili Kisisel Verilerin Korunmasi Kanunu (&quot;KVKK&quot;) uyarinca, kisisel verileriniz veri sorumlusu
          sifatiyla <strong>Yasemin [Soyad]</strong> (ticari unvan: Yasemin&apos;s Atelier) tarafindan asagida aciklanan amaclarla
          islenmektedir.
        </p>
        <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          <p><strong>Adres:</strong> Istanbul, Turkiye</p>
          <p><strong>E-posta:</strong> kvkk@yaseminsatelier.com</p>
          <p><strong>Telefon:</strong> +90 5XX XXX XX XX</p>
        </div>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">2. Kisisel Verilerin Islenme Amaclari</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          Kisisel verileriniz asagidaki amaclarla islenmektedir:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>Urun ve hizmet satis sureclerinin yurutulmesi</li>
          <li>Siparis, odeme ve teslimat islemlerinin gerceklestirilmesi</li>
          <li>Musteri iliskileri yonetimi ve destek hizmetleri</li>
          <li>Sadakat programi ve kampanyalarin yurutulmesi</li>
          <li>Yasal yukumluluklerin yerine getirilmesi (fatura, vergi beyannamesi)</li>
          <li>Elektronik ticari ileti gonderilmesi (acik rizaniz dahilinde)</li>
          <li>Web sitesi kullanim analizleri ve iyilestirme calismalari</li>
          <li>Bilgi guvenligi sureclerinin yurutulmesi</li>
        </ul>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">3. Kisisel Verilerin Aktarilmasi</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          Toplanan kisisel verileriniz, yukarida belirtilen amaclar dogrultusunda asagidaki alici gruplarina aktarilabilir:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>Odeme kuruluslari (Stripe, iyzico) - odeme islemlerinin gerceklestirilmesi</li>
          <li>Kargo ve kurye sirketleri - teslimat sureclerinin yurutulmesi</li>
          <li>E-posta hizmet saglayicisi (Resend) - bildirim ve pazarlama iletileri</li>
          <li>SMS hizmet saglayicisi (Netgsm) - siparis bildirimleri</li>
          <li>Analitik hizmet saglayicilari (Google Analytics) - site kullanim analizi</li>
          <li>Yetkili kamu kurum ve kuruluslari - yasal yukumlulukler kapsaminda</li>
        </ul>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">4. Veri Toplama Yontemi ve Hukuki Sebebi</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          Kisisel verileriniz; web sitemiz, mobil uygulama, e-posta, telefon ve sosyal medya kanallari araciligiyla
          otomatik ve otomatik olmayan yontemlerle toplanmaktadir.
        </p>
        <p className="mb-2 leading-relaxed text-neutral-700">
          Bu verilerin islenmesinin hukuki sebepleri KVKK Madde 5/2 kapsaminda sunlardir:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>Kanunlarda acikca ongorulmesi (VUK, TTK, Tuketici Mevzuati)</li>
          <li>Bir sozlesmenin kurulmasi veya ifasiyla dogrudan ilgili olmasi</li>
          <li>Veri sorumlusunun hukuki yukumlulugunu yerine getirmesi</li>
          <li>Ilgili kisinin temel hak ve ozgurluklerine zarar vermemek kaydiyla veri sorumlusunun mesru menfaati</li>
          <li>Ilgili kisinin acik rizasi (pazarlama, cerezler)</li>
        </ul>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">5. Ilgili Kisi Olarak Haklariniz</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          KVKK Madde 11 uyarinca asagidaki haklara sahipsiniz:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>Kisisel verilerinizin islenip islenmedigini ogrenme</li>
          <li>Kisisel verileriniz islenmisse buna iliskin bilgi talep etme</li>
          <li>Kisisel verilerinizin islenme amacini ve bunlarin amacina uygun kullanilip kullanilmadigini ogrenme</li>
          <li>Yurt icinde veya yurt disinda kisisel verilerinizin aktarildigi ucuncu kisileri bilme</li>
          <li>Kisisel verilerinizin eksik veya yanlis islenmis olmasi halinde bunlarin duzeltilmesini isteme</li>
          <li>KVKK Madde 7&apos;deki sartlar cercevesinde kisisel verilerinizin silinmesini veya yok edilmesini isteme</li>
          <li>Yapilan islemlerin kisisel verilerin aktarildigi ucuncu kisilere bildirilmesini isteme</li>
          <li>Islenen verilerin munhasiran otomatik sistemler vasitasiyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya cikmasina itiraz etme</li>
          <li>Kanuna aykiri olarak islenmesi sebebiyle zarara ugramaniz halinde zararin giderilmesini talep etme</li>
        </ul>
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-neutral-700">
          <p className="font-semibold">Basvuru Yontemi</p>
          <p className="mt-1">
            Yukaridaki haklariniza iliskin taleplerinizi <strong>kvkk@yaseminsatelier.com</strong> adresine kimlik teyidi
            icin gerekli bilgilerle birlikte yazili olarak iletebilirsiniz. Basvurulariniz en gec 30 gun icinde ucretsiz
            olarak sonuclandirilacaktir.
          </p>
        </div>
      </section>
    </main>
  );
}

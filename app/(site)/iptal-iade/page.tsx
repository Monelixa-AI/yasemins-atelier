import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iptal ve Iade Politikasi",
  robots: { index: false, follow: false },
};

export default function IptalIadePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-[#3D1A0A]">Iptal ve Iade Politikasi</h1>
      <p className="mb-8 text-sm text-neutral-500">Son guncelleme: 01.01.2025</p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">1. Siparis Iptali</h2>
        <p className="leading-relaxed text-neutral-700">
          Siparislerinizi, planlanan teslimat saatinden en az <strong>12 saat once</strong> iptal edebilirsiniz. Iptal
          talebinizi hesabinizdaki &quot;Siparislerim&quot; sayfasindan veya hello@yaseminsatelier.com adresine e-posta gondererek
          iletebilirsiniz.
        </p>
        <ul className="ml-5 mt-2 list-disc space-y-1 text-neutral-700">
          <li>12 saatten fazla sure varsa: Tam iade yapilir</li>
          <li>12 saatten az sure kalmissa: Urun hazirligina baslanmis olabileceginden iptal kabul edilemeyebilir</li>
          <li>Ozel siparis ve kurumsal siparisler icin farkli iptal kosullari uygulanabilir</li>
        </ul>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">2. Iade Kosullari</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          6502 sayili Tuketicinin Korunmasi Hakkinda Kanun ve Mesafeli Sozlesmeler Yonetmeligi&apos;nin <strong>Madde 15/1-c</strong> hukmune
          gore, cayma hakkinin istisna oldugu durumlar:
        </p>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-neutral-700">
          <p className="font-semibold">Onemli Bilgi</p>
          <p className="mt-1">
            Niteligi itibariyle iade edilemeyecek, hizla bozulma veya son kullanma tarihi gecme ihtimali olan mallar
            cayma hakki kapsaminda degildir. Urunlerimiz gida niteligi tasidigimdan, teslim edildikten sonra hijyen ve
            gida guvenligi nedeniyle iade kabul edilememektedir.
          </p>
        </div>
        <p className="mt-3 leading-relaxed text-neutral-700">
          Ancak asagidaki durumlarda tam iade veya yeniden gonderim yapilir:
        </p>
        <ul className="ml-5 mt-1 list-disc space-y-1 text-neutral-700">
          <li>Yanlis urun teslim edilmesi</li>
          <li>Urunun hasarli veya bozuk teslim edilmesi</li>
          <li>Siparis edilen urunle teslim edilen urunun farkli olmasi</li>
        </ul>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">3. Iade Sureci ve Sureler</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          Iade onaylanan siparislerde geri odeme asagidaki sureler icinde gerceklestirilir:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li><strong>Kredi/Banka Karti ile Odeme:</strong> Iade tutari kartiniza 3-10 is gunu icinde yansir</li>
          <li><strong>Havale/EFT ile Odeme:</strong> Belirttiginiz banka hesabina 2-5 is gunu icinde aktarilir</li>
        </ul>
        <p className="mt-2 text-sm text-neutral-500">
          Geri odeme suresi bankaniza bagli olarak degisiklik gosterebilir. Yasemin&apos;s Atelier, iade islemini onayladiktan
          sonra odemeyi ayni gun baslatir.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">4. Hasarli Teslimat</h2>
        <p className="leading-relaxed text-neutral-700">
          Urun tesliminde herhangi bir hasar veya bozukluk tespit ederseniz, teslimat tarihinden itibaren{" "}
          <strong>72 saat icinde</strong> bizi bilgilendirmeniz gerekmektedir. Bildiriminizde:
        </p>
        <ul className="ml-5 mt-2 list-disc space-y-1 text-neutral-700">
          <li>Siparis numaraniz</li>
          <li>Hasarin fotograflari</li>
          <li>Sorunun kisa aciklamasi</li>
        </ul>
        <p className="mt-2 leading-relaxed text-neutral-700">
          bilgilerini <strong>hello@yaseminsatelier.com</strong> adresine gondermeniz yeterlidir. Talebiniz en gec 24 saat
          icinde degerlendirilecek ve sonuc bildirilecektir.
        </p>
      </section>

      {/* 5 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">5. Iletisim</h2>
        <p className="leading-relaxed text-neutral-700">
          Iptal ve iade talepleriniz icin:
        </p>
        <div className="mt-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
          <p><strong>E-posta:</strong> hello@yaseminsatelier.com</p>
          <p><strong>Telefon:</strong> +90 5XX XXX XX XX</p>
          <p className="mt-2 text-neutral-500">Calisma saatleri: Pazartesi haric her gun 10:00 - 21:00</p>
        </div>
      </section>
    </main>
  );
}

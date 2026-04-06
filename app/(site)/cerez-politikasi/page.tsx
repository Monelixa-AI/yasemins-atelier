import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cerez Politikasi",
  robots: { index: false, follow: false },
};

export default function CerezPolitikasiPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold text-[#3D1A0A]">Cerez Politikasi</h1>
      <p className="mb-8 text-sm text-neutral-500">Son guncelleme: 01.01.2025</p>

      {/* 1 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">1. Cerez Nedir?</h2>
        <p className="leading-relaxed text-neutral-700">
          Cerezler (cookies), web sitemizi ziyaret ettiginizde tarayiciniza veya cihaziniza yerlestirilen kucuk metin
          dosyalaridir. Cerezler, sizi taninmamiza, tercihlerinizi hatirlamiza ve size daha iyi bir deneyim sunmamiza
          yardimci olur. Bu politika, Yasemin&apos;s Atelier web sitesinde kullanilan cerezleri ve bunlari nasil
          yonetebileceginizi aciklar.
        </p>
      </section>

      {/* 2 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">2. Kullandigimiz Cerezler</h2>

        {/* Zorunlu */}
        <h3 className="mb-2 mt-4 text-lg font-medium text-[#3D1A0A]">Zorunlu Cerezler</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-50">
                <th className="px-3 py-2 text-left font-semibold">Cerez Adi</th>
                <th className="px-3 py-2 text-left font-semibold">Sure</th>
                <th className="px-3 py-2 text-left font-semibold">Amac</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">next-auth.session-token</td>
                <td className="px-3 py-2">Oturum</td>
                <td className="px-3 py-2">Kullanici oturum yonetimi</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">cookie-consent</td>
                <td className="px-3 py-2">1 yil</td>
                <td className="px-3 py-2">Cerez tercihlerinizin saklanmasi</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">cart</td>
                <td className="px-3 py-2">30 gun</td>
                <td className="px-3 py-2">Alisveris sepeti iceriginin saklanmasi</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Analitik */}
        <h3 className="mb-2 mt-6 text-lg font-medium text-[#3D1A0A]">Analitik Cerezler</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-50">
                <th className="px-3 py-2 text-left font-semibold">Cerez Adi</th>
                <th className="px-3 py-2 text-left font-semibold">Sure</th>
                <th className="px-3 py-2 text-left font-semibold">Amac</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">_ga</td>
                <td className="px-3 py-2">2 yil</td>
                <td className="px-3 py-2">Google Analytics - benzersiz ziyaretci tespiti</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">_ga_*</td>
                <td className="px-3 py-2">2 yil</td>
                <td className="px-3 py-2">Google Analytics - oturum durumu saklama</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pazarlama */}
        <h3 className="mb-2 mt-6 text-lg font-medium text-[#3D1A0A]">Pazarlama Cerezleri</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-50">
                <th className="px-3 py-2 text-left font-semibold">Cerez Adi</th>
                <th className="px-3 py-2 text-left font-semibold">Sure</th>
                <th className="px-3 py-2 text-left font-semibold">Amac</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">_fbp</td>
                <td className="px-3 py-2">3 ay</td>
                <td className="px-3 py-2">Meta Pixel - reklam olcumleme</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">utm_*</td>
                <td className="px-3 py-2">30 gun</td>
                <td className="px-3 py-2">Kampanya kaynak takibi</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Tercih */}
        <h3 className="mb-2 mt-6 text-lg font-medium text-[#3D1A0A]">Tercih Cerezleri</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-300 bg-neutral-50">
                <th className="px-3 py-2 text-left font-semibold">Cerez Adi</th>
                <th className="px-3 py-2 text-left font-semibold">Sure</th>
                <th className="px-3 py-2 text-left font-semibold">Amac</th>
              </tr>
            </thead>
            <tbody className="text-neutral-700">
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">locale</td>
                <td className="px-3 py-2">1 yil</td>
                <td className="px-3 py-2">Dil tercihi</td>
              </tr>
              <tr className="border-b border-neutral-200">
                <td className="px-3 py-2">theme</td>
                <td className="px-3 py-2">1 yil</td>
                <td className="px-3 py-2">Gorunum tercihi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">3. Cerez Yonetimi</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          Sitemizi ilk ziyaretinizde gosterilen cerez banner&apos;i araciligiyla tercihlerinizi belirleyebilirsiniz. Ayrica
          tarayici ayarlarinizdan cerezleri yonetebilir veya silebilirsiniz:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li><strong>Chrome:</strong> Ayarlar &gt; Gizlilik ve Guvenlik &gt; Cerezler</li>
          <li><strong>Firefox:</strong> Ayarlar &gt; Gizlilik &amp; Guvenlik &gt; Cerezler ve Site Verileri</li>
          <li><strong>Safari:</strong> Tercihler &gt; Gizlilik &gt; Cerezleri Yonet</li>
          <li><strong>Edge:</strong> Ayarlar &gt; Gizlilik, Arama ve Hizmetler &gt; Cerezler</li>
        </ul>
        <p className="mt-2 text-sm text-neutral-500">
          Not: Zorunlu cerezlerin devre disi birakilmasi sitenin duzgun calismamina neden olabilir.
        </p>
      </section>

      {/* 4 */}
      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-[#3D1A0A]">4. Ucuncu Taraf Cerezleri</h2>
        <p className="mb-2 leading-relaxed text-neutral-700">
          Sitemizde ucuncu taraf hizmet saglayicilarina ait cerezler de kullanilabilmektedir. Bu saglayicilarin kendi
          gizlilik politikalari gecerlidir:
        </p>
        <ul className="ml-5 list-disc space-y-1 text-neutral-700">
          <li>
            <strong>Google Analytics:</strong>{" "}
            <a href="https://policies.google.com/privacy" className="text-[#3D1A0A] underline" target="_blank" rel="noopener noreferrer">
              policies.google.com/privacy
            </a>
          </li>
          <li>
            <strong>Meta (Facebook):</strong>{" "}
            <a href="https://www.facebook.com/privacy/policy/" className="text-[#3D1A0A] underline" target="_blank" rel="noopener noreferrer">
              facebook.com/privacy/policy
            </a>
          </li>
          <li>
            <strong>Stripe:</strong>{" "}
            <a href="https://stripe.com/privacy" className="text-[#3D1A0A] underline" target="_blank" rel="noopener noreferrer">
              stripe.com/privacy
            </a>
          </li>
        </ul>
      </section>

      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        <p>
          Sorulariniz icin: <strong>kvkk@yaseminsatelier.com</strong> | Yasemin&apos;s Atelier, Istanbul, Turkiye
        </p>
      </div>
    </main>
  );
}

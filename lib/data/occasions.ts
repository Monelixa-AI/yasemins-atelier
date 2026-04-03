export interface OccasionFAQ {
  q: string;
  a: string;
}

export interface OccasionData {
  slug: string;
  dbSlug: string;
  name: string;
  tagline: string;
  description: string;
  longDesc: string;
  imageUrl: string;
  colorBg: string;
  colorAccent: string;
  icon: string;
  featuredProducts: string[];
  relatedBlogSlugs: string[];
  faqs: OccasionFAQ[];
  tips: string[];
  seoTitle: string;
  seoDesc: string;
}

export const occasions: OccasionData[] = [
  {
    slug: "misafir-agirma",
    dbSlug: "MISAFIR_AGIRMA",
    name: "Misafir Ağırlama",
    tagline: "İlk izlenim her zaman önemlidir.",
    description: "Misafirlerinize sunacağınız sofrayı birlikte kuralım. Onlara yakışır, size zaman kazandıran lezzetlerle.",
    longDesc: "Ev misafiri ağırlamak, Türk kültürünün en önemli geleneklerinden biridir. Yasemin's Atelier olarak bu geleneği yaşatıyor, her misafir sofrasını özenle hazırlıyoruz.",
    imageUrl: "/images/occasions/misafir-agirma.jpg",
    colorBg: "#8B3E18",
    colorAccent: "#B8975C",
    icon: "🥂",
    featuredProducts: ["1", "2", "3", "4"],
    relatedBlogSlugs: ["misafir-agirlamada-7-altin-kural"],
    faqs: [
      { q: "Kaç kişilik sipariş verebilirim?", a: "2 kişiden 50+ kişiye kadar her ölçekte hazırlık yapıyoruz." },
      { q: "Ne kadar önceden sipariş vermeliyim?", a: "Standart siparişler için 24 saat öncesi yeterli." },
      { q: "Sunum kapları dahil mi?", a: "Standart ambalajla teslim, premium sunum tabakları için ek seçenek mevcuttur." },
    ],
    tips: [
      "Kişi başı 3-4 meze çeşidi ideal başlangıçtır.",
      "Sıcak ve soğuk mezeleri karıştırmayı unutmayın.",
      "Sunum için birkaç saat önceden çıkarın.",
    ],
    seoTitle: "Misafir Ağırlama Sofrası | Yasemin's Atelier",
    seoDesc: "İstanbul'a özel el yapımı mezeler, börekler ve özel setler. Misafirleriniz için mükemmel sofra.",
  },
  {
    slug: "kadin-gunleri",
    dbSlug: "KADIN_GUNLERI",
    name: "Kadın Günleri",
    tagline: "Özel anlar, özel lezzetler.",
    description: "Kadın günlerinizi unutulmaz kılacak mini tatlılar, finger food ve çay saati lezzetleri.",
    longDesc: "Kadın günleri, dostlukların ve paylaşımın en güzel kutlamasıdır. Masanızı renklendirecek, misafirlerinizi şaşırtacak özel lezzetler hazırlıyoruz.",
    imageUrl: "/images/occasions/kadin-gunleri.jpg",
    colorBg: "#C4622D",
    colorAccent: "#F5DCC8",
    icon: "🌸",
    featuredProducts: ["5", "6", "7", "8"],
    relatedBlogSlugs: [],
    faqs: [
      { q: "Mini boy seçenekler var mı?", a: "Evet, tüm tatlı ve finger food ürünlerimiz mini boy sipariş edilebilir." },
      { q: "Görsel sunum önemli mi?", a: "Kadın günleri için özellikle özenli sunum ve ambalaj hazırlıyoruz." },
    ],
    tips: [
      "Mini boy finger food'lar kadın günleri için idealdir.",
      "Tatlı çeşitliliği şart — en az 3 farklı seçenek öneririz.",
      "Renkli sunum tabakları atmosferi tamamlar.",
    ],
    seoTitle: "Kadın Günleri Sofrası | Yasemin's Atelier",
    seoDesc: "Kadın günleriniz için el yapımı tatlılar, finger food ve özel setler. İstanbul teslimat.",
  },
  {
    slug: "dogum-gunu",
    dbSlug: "DOGUM_GUNU",
    name: "Doğum Günü",
    tagline: "Her yaş, özel bir kutlamayı hak eder.",
    description: "Özel kekler, kutlama mezeleri ve tatlı çeşitleriyle doğum günlerini unutulmaz kılıyoruz.",
    longDesc: "Doğum günü sofrası sadece pasta değildir. Yasemin's Atelier olarak tüm masayı özel günün ruhuna uygun hazırlıyoruz.",
    imageUrl: "/images/occasions/dogum-gunu.jpg",
    colorBg: "#B8975C",
    colorAccent: "#FDF6EE",
    icon: "🎂",
    featuredProducts: ["1", "3", "5", "6"],
    relatedBlogSlugs: ["dogum-gunu-icin-ozel-tatlilar"],
    faqs: [
      { q: "Özel istek yazısı yapılabiliyor mu?", a: "Evet, kişiselleştirilmiş kek ve tatlılar için önceden bilgi alıyoruz." },
    ],
    tips: [
      "Kişi sayısına göre porsiyon hesabı yapın.",
      "Tatlı çeşitliliği kadar meze de unutulmamalı.",
    ],
    seoTitle: "Doğum Günü Sofrası | Yasemin's Atelier",
    seoDesc: "Özel doğum günü kekleri ve tatlıları. El yapımı, kişiselleştirilmiş lezzetler.",
  },
  {
    slug: "is-yemegi",
    dbSlug: "IS_YEMEGI",
    name: "İş Yemeği",
    tagline: "Profesyonel sofralar, güçlü izlenimler.",
    description: "Kurumsal yemekler ve müşteri toplantıları için sofistike sunum tabakları ve meze setleri.",
    longDesc: "İş yemeklerinde sofra bir mesaj verir. Kalite, özen ve profesyonellik — Yasemin's Atelier bu mesajı sizin adınıza iletir.",
    imageUrl: "/images/occasions/is-yemegi.jpg",
    colorBg: "#3D1A0A",
    colorAccent: "#B8975C",
    icon: "💼",
    featuredProducts: ["2", "3", "4", "7"],
    relatedBlogSlugs: ["is-yemegi-icin-pratik-meze-secimi"],
    faqs: [
      { q: "Fatura kesilebiliyor mu?", a: "Evet, kurumsal fatura talebi için sipariş notuna şirket bilgilerinizi ekleyin." },
      { q: "Son dakika sipariş mümkün mü?", a: "12+ saat öncesi bildirimde bulunursanız elimizden geleni yaparız." },
    ],
    tips: [
      "Sade ve sofistike sunum iş ortamına uygundur.",
      "Allerjen bilgisini önceden toplayın.",
      "Kişi başı 200-300₺ bütçe genellikle yeterlidir.",
    ],
    seoTitle: "İş Yemeği Catering | Yasemin's Atelier",
    seoDesc: "Kurumsal yemekler için profesyonel catering. İstanbul ofis teslimat.",
  },
  {
    slug: "kurumsal-hediye",
    dbSlug: "KURUMSAL_HEDIYE",
    name: "Kurumsal Hediye",
    tagline: "En anlamlı hediye, el emeğiyle yapılandır.",
    description: "Şirket hediye kutuları, markalı ambalaj ve toplu hediye çözümleri.",
    longDesc: "Kurumsal hediyeler fark yaratır. Yasemin's Atelier'in el yapımı ürünleri, markanızı en iyi şekilde temsil eder.",
    imageUrl: "/images/occasions/kurumsal-hediye.jpg",
    colorBg: "#6B3520",
    colorAccent: "#E8D5A3",
    icon: "🎁",
    featuredProducts: ["8", "9", "10", "11"],
    relatedBlogSlugs: [],
    faqs: [
      { q: "Logo baskısı yapılabiliyor mu?", a: "Ambalaj üzerine şirket logosu ve özel tasarım için iletişime geçin." },
      { q: "Minimum sipariş adedi nedir?", a: "Kurumsal hediye siparişleri için minimum 10 adet." },
    ],
    tips: [
      "Sezonluk koleksiyonlar için önceden rezervasyon yapın.",
      "Kişiselleştirilmiş not kartı ekleyebilirsiniz.",
    ],
    seoTitle: "Kurumsal Hediye | Yasemin's Atelier",
    seoDesc: "El yapımı kurumsal hediye kutuları. Markalı ambalaj, toplu sipariş.",
  },
  {
    slug: "ev-partisi",
    dbSlug: "EV_PARTISI",
    name: "Ev Partisi",
    tagline: "Büyük eğlence, küçük detaylar.",
    description: "Ev partileri için büfe setleri, büyük porsiyonlar ve kolay servis alternatifleri.",
    longDesc: "Parti hazırlığı stres değil, keyif olmalı. Mutfakta geçireceğiniz zamanı bize bırakın, misafirlerinizle vakit geçirin.",
    imageUrl: "/images/occasions/ev-partisi.jpg",
    colorBg: "#C4622D",
    colorAccent: "#F5DCC8",
    icon: "🎊",
    featuredProducts: ["1", "2", "5", "6"],
    relatedBlogSlugs: [],
    faqs: [
      { q: "Büfe düzeni için ne önerirsiniz?", a: "Soğuk mezeler, sıcak börekler ve tatlılar üçlüsü ev partisi için idealdir." },
    ],
    tips: [
      "15+ kişi için büfe düzeni tabak servisine göre pratiktir.",
      "Önceden ısıtılabilir ürünleri tercih edin.",
    ],
    seoTitle: "Ev Partisi Catering | Yasemin's Atelier",
    seoDesc: "Ev partileri için büfe setleri ve büyük porsiyonlar. İstanbul teslimat.",
  },
  {
    slug: "kahvalti",
    dbSlug: "KAHVALTI",
    name: "Kahvaltı Sofrası",
    tagline: "Güne en güzel başlangıç.",
    description: "Ev yapımı reçeller, taze börekler, peynir tabakları ve hafta sonu özel kahvaltı setleri.",
    longDesc: "Türk kahvaltısı dünyaca ünlüdür. Yasemin's Atelier olarak bu geleneği sofralarınıza taşıyoruz.",
    imageUrl: "/images/occasions/kahvalti.jpg",
    colorBg: "#B8975C",
    colorAccent: "#FDF6EE",
    icon: "☕",
    featuredProducts: ["12", "13", "14"],
    relatedBlogSlugs: [],
    faqs: [
      { q: "Hafta içi teslimat var mı?", a: "Evet, hafta içi ve hafta sonu teslimat yapıyoruz." },
    ],
    tips: [
      "Kişi başı 4-5 çeşit yeterli bir kahvaltı sofrası oluşturur.",
      "Taze ekmek ve poğaça da ekleyebilirsiniz.",
    ],
    seoTitle: "Kahvaltı Sofrası | Yasemin's Atelier",
    seoDesc: "El yapımı reçeller, börekler ve kahvaltı setleri. İstanbul teslimat.",
  },
  {
    slug: "saglikli",
    dbSlug: "SAGLIKLI",
    name: "Sağlıklı & Diyet",
    tagline: "Lezzetten ödün vermeden, sağlıklı.",
    description: "Düşük kalorili mezeler, vegan seçenekler ve diyet dostu alternatifler.",
    longDesc: "Sağlıklı beslenmek lezzetsiz olmak zorunda değildir. Yasemin's Atelier olarak her diyet ihtiyacına özel çözümler sunuyoruz.",
    imageUrl: "/images/occasions/saglikli.jpg",
    colorBg: "#4A7C3F",
    colorAccent: "#EAF3DE",
    icon: "🥗",
    featuredProducts: ["15", "16", "17"],
    relatedBlogSlugs: [],
    faqs: [
      { q: "Vegan seçenekler var mı?", a: "Evet, birçok ürünümüz vegan ve vejetaryen dostu." },
      { q: "Kalori bilgisi alabilir miyim?", a: "Talep üzerine ürün bazında kalori bilgisi paylaşıyoruz." },
    ],
    tips: [
      "Protein ağırlıklı mezeler tokluk hissi verir.",
      "Taze otlar ve limon lezzeti artırır.",
    ],
    seoTitle: "Sağlıklı Meze & Diyet Seçenekler | Yasemin's Atelier",
    seoDesc: "Vegan, glutensiz ve diyet dostu el yapımı lezzetler.",
  },
  {
    slug: "mevsimsel",
    dbSlug: "MEVSIMSEL",
    name: "Mevsimsel & Özel",
    tagline: "Her mevsim, yeni lezzetler.",
    description: "Ramazan, Kurban Bayramı, Yılbaşı ve özel günlere özel koleksiyonlar.",
    longDesc: "Yılın her dönemi kendine özgü lezzetler barındırır. Mevsimsel koleksiyonlarımızla bu anları daha anlamlı kılıyoruz.",
    imageUrl: "/images/occasions/mevsimsel.jpg",
    colorBg: "#8B3E18",
    colorAccent: "#E8D5A3",
    icon: "🌙",
    featuredProducts: ["1", "4", "8", "10"],
    relatedBlogSlugs: [],
    faqs: [
      { q: "Ramazan özel menüsü ne zaman çıkıyor?", a: "Ramazan başlamadan 2 hafta önce özel koleksiyon duyurulur." },
    ],
    tips: [
      "Bayram öncesi erken sipariş verin, slotlar hızlı dolar.",
      "Toplu hediye siparişleri için önceden iletişime geçin.",
    ],
    seoTitle: "Mevsimsel Koleksiyonlar | Yasemin's Atelier",
    seoDesc: "Ramazan, bayram ve yılbaşı özel koleksiyonları. El yapımı lezzetler.",
  },
];

export interface ServicePackage {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServiceStep {
  step: number;
  title: string;
  desc: string;
}

export interface ServiceData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDesc: string;
  icon: string;
  colorBg: string;
  imageUrl: string;
  steps: ServiceStep[];
  packages: ServicePackage[];
  faqs: ServiceFAQ[];
  relatedOccasions: string[];
  seoTitle: string;
  seoDesc: string;
}

export const services: ServiceData[] = [
  {
    slug: "eve-sef",
    name: "Eve Şef",
    tagline: "Yasemin mutfağınıza gelsin.",
    description: "Yasemin evinize gelir, kendi malzemeleriyle doğal, organik, katkısız yemekler pişirir. Dumanı üstünde sofra, sıfır stres.",
    longDesc: "Yoğun iş temposu, çocuklu aile hayatı veya sadece gerçek ev yemeği özlemi — sebebi ne olursa olsun, Yasemin randevuyla evinize gelir. Kendi seçtiği taze, organik malzemelerle sofralarınıza lezzet taşır. Mutfağınızda pişirir, masayı kurar, siz sadece keyfini çıkarırsınız.",
    icon: "👩‍🍳",
    colorBg: "#8B3E18",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
    steps: [
      { step: 1, title: "Randevu Alın", desc: "Tarih, kişi sayısı ve tercihlerinizi bildirin." },
      { step: 2, title: "Menü Planlayın", desc: "Yasemin ile birlikte menüyü özelleştirin." },
      { step: 3, title: "Şef Evinize Gelsin", desc: "Yasemin taze malzemeleriyle kapınızda." },
      { step: 4, title: "Keyfini Çıkarın", desc: "Dumanı üstünde yemekler, tertemiz mutfak." },
    ],
    packages: [
      { name: "Temel", price: "1.500₺", features: ["2-4 kişilik", "3 çeşit yemek", "2 saat hizmet", "Malzeme dahil"] },
      { name: "Premium", price: "2.800₺", features: ["4-8 kişilik", "5 çeşit yemek + tatlı", "3 saat hizmet", "Malzeme dahil", "Sofra düzeni"], popular: true },
      { name: "VIP", price: "4.500₺", features: ["8-12 kişilik", "7 çeşit yemek + tatlı", "4 saat hizmet", "Premium malzeme", "Sofra düzeni + dekorasyon", "Özel menü tasarımı"] },
    ],
    faqs: [
      { q: "Yasemin hangi bölgelere geliyor?", a: "Tüm İstanbul Avrupa ve Anadolu yakasına hizmet veriyoruz." },
      { q: "Malzemeleri ben alabilir miyim?", a: "Hayır, kalite kontrolü için tüm malzemeler Yasemin tarafından temin edilir ve fiyata dahildir." },
      { q: "Ne kadar önceden randevu almalıyım?", a: "En az 3 gün öncesi önerilir. Hafta sonları için 1 hafta öncesi ideal." },
      { q: "Mutfağım küçük, sorun olur mu?", a: "Yasemin her mutfakta çalışabilir. Temel ihtiyaçlar: ocak, fırın ve lavabo." },
      { q: "Temizlik dahil mi?", a: "Evet, Yasemin kullandığı tüm ekipmanları temizler, mutfağı teslim aldığı gibi bırakır." },
    ],
    relatedOccasions: ["misafir-agirma", "dogum-gunu", "ev-partisi"],
    seoTitle: "Eve Şef Hizmeti | Yasemin's Atelier",
    seoDesc: "Gastronomi şefi Yasemin evinize gelsin. Organik malzeme, kişisel menü, sıfır stres. İstanbul geneli.",
  },
  {
    slug: "davet-organizasyon",
    name: "Davet Organizasyonu",
    tagline: "Sofranızı baştan sona planlayalım.",
    description: "Ev davetleriniz için menü hazırlığı, dekorasyon danışmanlığı, malzeme organizasyonu ve sunum. Full-service concierge.",
    longDesc: "Özel bir akşam yemeği, nişan, kına ya da küçük bir kutlama — her davet özel bir planlama gerektirir. Yasemin temel yemekleri kendi elleriyle hazırlar, diğer ihtiyaçları organize eder: kanepe siparişi, masa düzeni, çiçek tercihi, servis tabakları. Siz sadece misafirlerinize odaklanın.",
    icon: "🎪",
    colorBg: "#C4622D",
    imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80",
    steps: [
      { step: 1, title: "Detayları Paylaşın", desc: "Davet tarihi, kişi sayısı, bütçe ve tarzınız." },
      { step: 2, title: "Planlama Toplantısı", desc: "Yasemin ile menü, dekorasyon ve akış planlanır." },
      { step: 3, title: "Hazırlık & Kurulum", desc: "Yemekler hazırlanır, sofra kurulur, dekorasyon yapılır." },
      { step: 4, title: "Davetiniz Başlasın", desc: "Her şey hazır, siz sadece kapıyı açın." },
    ],
    packages: [
      { name: "Sadece Menü", price: "2.000₺", features: ["6-10 kişilik", "4 çeşit yemek hazırlığı", "Servis tabakları", "Menü danışmanlığı"] },
      { name: "Menü + Organizasyon", price: "3.500₺", features: ["10-20 kişilik", "6 çeşit yemek", "Kanepe & tatlı organizasyonu", "Masa düzeni & dekorasyon danışmanlığı", "Çiçek & malzeme koordinasyonu"], popular: true },
      { name: "Full Concierge", price: "6.000₺+", features: ["20+ kişilik", "Tam menü hazırlığı", "Profesyonel dekorasyon", "Servis personeli koordinasyonu", "Çiçek, müzik, sunum", "A'dan Z'ye organizasyon"] },
    ],
    faqs: [
      { q: "Sadece yemek hazırlığı yeterli mi?", a: "Evet, sadece menü paketi alabilirsiniz. Organizasyon opsiyoneldir." },
      { q: "Dekorasyon malzemeleri dahil mi?", a: "Danışmanlık dahil, malzeme maliyeti ayrıca faturalandırılır." },
      { q: "Servis personeli sağlıyor musunuz?", a: "Full Concierge paketinde koordine ediyoruz, garson hizmeti partnerimiz aracılığıyla." },
    ],
    relatedOccasions: ["misafir-agirma", "dogum-gunu", "kadin-gunleri", "ev-partisi"],
    seoTitle: "Davet Organizasyonu | Yasemin's Atelier",
    seoDesc: "Ev davetleriniz için yemek hazırlığı, dekorasyon danışmanlığı ve organizasyon. İstanbul.",
  },
  {
    slug: "ofis-yemek",
    name: "Ofis Öğle Yemeği",
    tagline: "Küçük ekibinize büyük lezzetler.",
    description: "2-10 kişilik şirketlere, 1 gün önceden sipariş ile ertesi gün taze hazırlanmış öğle yemeği. Yasemin'in hünerli ellerinden.",
    longDesc: "Küçük ofislerde yemek sorunu büyük bir sorun. Dışarıda yemek pahalı, getirtmek kalitesiz. Yasemin's Atelier çözümü: 1 gün öncesinden sipariş verin, ertesi gün öğle yemeğiniz taze ve sıcak ofiste. Haftalık abonelik ile hem tasarruf edin hem de ekibinize değer verin.",
    icon: "🏢",
    colorBg: "#3D1A0A",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    steps: [
      { step: 1, title: "Haftalık Menü Seçin", desc: "Her Cuma yayınlanan gelecek hafta menüsünden seçin." },
      { step: 2, title: "Sipariş Verin", desc: "1 gün öncesi saat 18:00'e kadar sipariş." },
      { step: 3, title: "Taze Hazırlanır", desc: "Sabah erken saatte Yasemin tarafından pişirilir." },
      { step: 4, title: "Ofisinize Teslim", desc: "12:00-13:00 arası sıcak teslim." },
    ],
    packages: [
      { name: "Günlük", price: "Kişi başı 120₺", features: ["Ana yemek + salata", "Ekmek dahil", "1 gün önce sipariş", "Minimum 3 kişi"] },
      { name: "Haftalık Abonelik", price: "Kişi başı 100₺/gün", features: ["Haftada 5 gün", "Ana yemek + salata + tatlı", "Mevsimsel menü", "Minimum 3 kişi", "%17 tasarruf"], popular: true },
      { name: "Aylık Abonelik", price: "Kişi başı 90₺/gün", features: ["Ayda 20 gün", "Ana yemek + salata + tatlı", "Özel diyet seçenekleri", "Minimum 3 kişi", "%25 tasarruf", "Öncelikli teslimat"] },
    ],
    faqs: [
      { q: "Minimum sipariş kaç kişilik?", a: "Minimum 3, maksimum 10 kişi." },
      { q: "Teslimat saati değiştirilebilir mi?", a: "11:30-13:30 aralığında tercih edebilirsiniz." },
      { q: "Diyet ve allerjen seçenekleri var mı?", a: "Evet, vegan, glutensiz ve allerjen-free seçenekler mevcut." },
      { q: "Aboneliği istediğim zaman iptal edebilir miyim?", a: "Aylık abonelikler 1 hafta öncesi bildirimle iptal edilebilir." },
    ],
    relatedOccasions: ["is-yemegi"],
    seoTitle: "Ofis Öğle Yemeği | Yasemin's Atelier",
    seoDesc: "Küçük ekiplere günlük taze yemek. Haftalık ve aylık abonelik. İstanbul ofis teslimat.",
  },
  {
    slug: "workshop",
    name: "Mutfak Atölyesi",
    tagline: "Yasemin ile birlikte pişirin.",
    description: "6-10 kişilik gruplar için interaktif yemek yapma atölyesi. Kadın günü, team building, bekarlığa veda için mükemmel.",
    longDesc: "Yemek yapmak bir sanat, birlikte yapmak ise bir deneyim. Yasemin'in rehberliğinde, el açması börek, meze hazırlama veya özel tatlı atölyelerine katılın. Malzemeler hazır, tarif elinizde — gerisi keyif ve kahkaha. Kadın günleri, doğum günleri ve team building etkinlikleri için ideal.",
    icon: "🍳",
    colorBg: "#B8975C",
    imageUrl: "https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=800&q=80",
    steps: [
      { step: 1, title: "Tema Seçin", desc: "Börek, meze, tatlı veya özel tema belirleyin." },
      { step: 2, title: "Tarih & Mekan", desc: "Yasemin'in atölyesi veya sizin mekanınız." },
      { step: 3, title: "Birlikte Pişirin", desc: "3 saat boyunca eller hamurda, ağızlar tatda." },
      { step: 4, title: "Birlikte Yiyin", desc: "Yaptıklarınızı birlikte sofrada tadın." },
    ],
    packages: [
      { name: "Mini Atölye", price: "Kişi başı 350₺", features: ["4-6 kişi", "2 saat", "1 ana tarif", "Malzeme dahil", "Tarif kartı hediye"] },
      { name: "Standart Atölye", price: "Kişi başı 500₺", features: ["6-10 kişi", "3 saat", "2 tarif + tatlı", "Malzeme dahil", "Önlük hediye", "Fotoğraf çekimi"], popular: true },
      { name: "Özel Etkinlik", price: "İletişime geçin", features: ["10+ kişi", "4 saat", "Özel tema", "Tam menü hazırlığı", "Profesyonel fotoğraf", "Kişiselleştirilmiş deneyim"] },
    ],
    faqs: [
      { q: "Yemek yapmayı bilmeyenler katılabilir mi?", a: "Kesinlikle! Her seviyeye uygun, adım adım rehberlik ediyoruz." },
      { q: "Kendi mekanımızda yapılabilir mi?", a: "Evet, uygun bir mutfak alanı varsa sizin mekanınızda da yapabiliriz." },
      { q: "Çocuklar katılabilir mi?", a: "12 yaş üstü katılabilir. Özel çocuk atölyeleri için iletişime geçin." },
      { q: "Kurumsal team building için uygun mu?", a: "Mükemmel! Özel Etkinlik paketimiz tam bunun için tasarlandı." },
    ],
    relatedOccasions: ["kadin-gunleri", "dogum-gunu", "ev-partisi"],
    seoTitle: "Mutfak Atölyesi | Yasemin's Atelier",
    seoDesc: "Yasemin ile birlikte yemek yapma atölyesi. Kadın günü, team building, özel etkinlik. İstanbul.",
  },
  {
    slug: "lezzet-kutusu",
    name: "Aylık Lezzet Kutusu",
    tagline: "Her ay kapınızda yeni lezzetler.",
    description: "Her ay temalı, mevsimsel 4-6 el yapımı ürün kapınıza gelsin. Abonelik ile %15 tasarruf.",
    longDesc: "Her ayın ilk haftası, Yasemin'in özenle hazırladığı temalı lezzet kutusu kapınızda. Bu ay Ege mutfağı, gelecek ay Güneydoğu lezzetleri — her kutuda sürpriz. İçinde 4-6 el yapımı ürün, tarif kartları ve Yasemin'den kişisel bir not. Kendinize veya sevdiklerinize en güzel hediye.",
    icon: "📦",
    colorBg: "#6B3520",
    imageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80",
    steps: [
      { step: 1, title: "Abonelik Seçin", desc: "1, 3, 6 veya 12 aylık planlardan birini seçin." },
      { step: 2, title: "Tercihleri Belirtin", desc: "Diyet kısıtlamaları ve lezzet tercihleriniz." },
      { step: 3, title: "Her Ay Sürpriz", desc: "Ayın ilk haftası temalı kutunuz kapınızda." },
      { step: 4, title: "Keşfedin & Tadın", desc: "Tarif kartlarıyla yeni lezzetler keşfedin." },
    ],
    packages: [
      { name: "1 Aylık", price: "380₺/ay", features: ["4-6 el yapımı ürün", "Mevsimsel tema", "Tarif kartları", "İstanbul içi ücretsiz kargo"] },
      { name: "3 Aylık", price: "340₺/ay", features: ["4-6 el yapımı ürün", "Mevsimsel tema", "Tarif kartları", "Ücretsiz kargo", "%10 tasarruf", "Sürpriz hediye (3. ay)"], popular: true },
      { name: "6 Aylık", price: "320₺/ay", features: ["4-6 el yapımı ürün", "Mevsimsel tema", "Tarif kartları", "Ücretsiz kargo", "%15 tasarruf", "Önlük hediye", "Özel tarif kitapçığı"] },
    ],
    faqs: [
      { q: "Kutunun içinde ne var?", a: "Her ay farklı tema ile 4-6 el yapımı ürün: mezeler, reçeller, kurabiyeler, baharatlar vs." },
      { q: "Hediye olarak gönderebilir miyim?", a: "Evet! Sipariş sırasında farklı teslimat adresi ve hediye notu ekleyebilirsiniz." },
      { q: "Allerjen hassasiyetim var, uygun mu?", a: "Abonelik sırasında diyet kısıtlamalarınızı belirtirseniz kutu buna göre hazırlanır." },
      { q: "Aboneliği durdurabilir miyim?", a: "İstediğiniz zaman sonraki aydan itibaren duraklatabilir veya iptal edebilirsiniz." },
    ],
    relatedOccasions: ["kurumsal-hediye", "mevsimsel"],
    seoTitle: "Aylık Lezzet Kutusu | Yasemin's Atelier",
    seoDesc: "Her ay temalı el yapımı lezzet kutusu. Abonelik ile tasarruf. İstanbul ücretsiz kargo.",
  },
];

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  occasion?: string;
  readingMins: number;
  publishedAt: string;
  isFeatured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "sonbahar-en-iyi-meze-patlican",
    title: "Sonbaharın En İyi Mezesi: Közlenmiş Patlıcan",
    excerpt:
      "Patlıcanın en lezzetli olduğu mevsimde, közleme tekniğinin sırları ve farklı meze varyasyonları.",
    content: `<p>Közlenmiş patlıcan, Türk mutfağının en zarif mezelerinden biridir. Doğru teknikle hazırlandığında, dumanımsı aroması ve kremsi dokusuyla sofranızın yıldızı olur.</p>
<h2>Doğru Patlıcan Seçimi</h2>
<p>Közleme için uzun, ince kabuklu patlıcanları tercih edin. Patlıcanın sapı taze ve yeşil olmalı, kabuğu parlak ve pürüzsüz olmalıdır. Çok büyük patlıcanlar çekirdekli olabilir.</p>
<h2>Közleme Tekniği</h2>
<p>Patlıcanları doğrudan ateş üzerinde, her tarafı eşit yanacak şekilde çevirin. Kabuğun tamamen kararması ve iç kısmın yumuşaması önemlidir. Bu işlem yaklaşık 15-20 dakika sürer.</p>
<blockquote>Közlemenin sırrı sabırdır. Acele etmeyin, patlıcanın kendi zamanında pişmesine izin verin.</blockquote>
<h2>Servis Önerileri</h2>
<p>Közlenmiş patlıcanı zeytinyağı, sarımsak, limon suyu ve tuz ile ezin. Üzerine nar taneleri ve taze nane yaprakları ekleyerek servis edin. Yanında sıcak pide ekmeği muhteşem bir uyum yaratır.</p>`,
    coverImage: "/images/blog-1.jpg",
    category: "Tarife İpuçları",
    tags: ["patlıcan", "meze", "sonbahar"],
    occasion: "MISAFIR_AGIRMA",
    readingMins: 4,
    publishedAt: "2024-10-15",
    isFeatured: true,
  },
  {
    id: "2",
    slug: "misafir-agirlamada-7-altin-kural",
    title: "Misafir Ağırlamada 7 Altın Kural",
    excerpt:
      "İlk izlenim her zaman önemlidir. Sofradan önce başlayan hazırlık sürecinin püf noktaları.",
    content: `<p>Misafir ağırlama, Türk kültürünün en köklü geleneklerinden biridir. İyi bir ev sahibi olmak, sadece yemek hazırlamaktan ibaret değildir — tüm deneyimi düşünmek gerekir.</p>
<h2>1. Önceden Planlayın</h2>
<p>En az 2 gün öncesinden menünüzü belirleyin. Son dakika telaşı hem sizi yorar hem de sonucu etkiler.</p>
<h2>2. Sofra Düzeni</h2>
<p>Sofranız yemeğiniz kadar önemlidir. Temiz örtü, uyumlu tabaklar ve küçük çiçek düzenlemeleri fark yaratır.</p>
<h2>3. Mezeyle Başlayın</h2>
<p>Misafirler geldiğinde hazır bir meze tabağı olsun. Bu hem sizi rahatlatır hem de misafirlere karşılama hissi verir.</p>`,
    coverImage: "/images/blog-2.jpg",
    category: "Occasion Rehberleri",
    tags: ["misafir", "sofra", "hazırlık"],
    readingMins: 6,
    publishedAt: "2024-10-08",
    isFeatured: false,
  },
  {
    id: "3",
    slug: "istanbul-pazarlarinda-malzeme-rehberi",
    title: "İstanbul Pazarlarında Taze Malzeme Rehberi",
    excerpt:
      "Hangi pazarda ne alınır? Mevsimlik ürünlerin en iyisini bulmak için Yasemin'in kişisel rehberi.",
    content: `<p>İstanbul'un semt pazarları, taze ve yerel malzemenin en güvenilir kaynağıdır. Her pazarın kendine özgü bir karakteri vardır.</p>
<h2>Kadıköy Salı Pazarı</h2>
<p>Organik sebze ve meyve için en iyi adres. Özellikle yeşillik çeşitleri ve zeytinyağları için mutlaka uğrayın.</p>
<h2>Beşiktaş Cumartesi Pazarı</h2>
<p>Deniz ürünleri ve peynir çeşitleri için idealdir. Karadeniz yöresinden gelen taze tereyağı burada bulunur.</p>
<blockquote>Pazara erken gidin. En taze ürünler sabah ilk saatlerde tezgâha çıkar.</blockquote>`,
    coverImage: "/images/blog-3.jpg",
    category: "Malzeme Hikayeleri",
    tags: ["pazar", "istanbul", "mevsimlik"],
    readingMins: 5,
    publishedAt: "2024-09-22",
    isFeatured: false,
  },
  {
    id: "4",
    slug: "is-yemegi-icin-pratik-meze-secimi",
    title: "İş Yemeği İçin Pratik Meze Seçimi",
    excerpt:
      "Kurumsal bir yemekte hem etkileyici hem pratik nasıl bir sofra kurarsınız?",
    content: `<p>İş yemekleri, profesyonel imajınızın bir parçasıdır. Doğru meze seçimi hem misafirlerinizi etkiler hem de toplantınızın akışını bozmaz.</p>
<h2>Pratik Ama Şık</h2>
<p>Parmak yiyecekler ve tek lokmada yenilebilecek mezeler tercih edin. Su böreği dilimleri, mini kısır porsiyon ve humus dip çanak ideal seçeneklerdir.</p>
<h2>Sunum Önemli</h2>
<p>Kurumsal bir yemekte sunumun kalitesi lezzetin önüne geçer. Minimalist tabaklar ve düzenli yerleşim profesyonel bir izlenim bırakır.</p>`,
    coverImage: "/images/blog-4.jpg",
    category: "Occasion Rehberleri",
    tags: ["iş yemeği", "kurumsal", "meze"],
    readingMins: 3,
    publishedAt: "2024-09-10",
    isFeatured: false,
  },
  {
    id: "5",
    slug: "dogum-gunu-icin-ozel-tatlilar",
    title: "Doğum Günü İçin Özel Tatlılar",
    excerpt:
      "Standart pasta yerine ne? Yasemin'in doğum günü sofrası için önerdiği alternatif tatlı fikirleri.",
    content: `<p>Her doğum günü özeldir ve tatlısı da öyle olmalı. Standart kremalı pastaların ötesinde, misafirlerinizi şaşırtacak alternatifler var.</p>
<h2>Baklava Kulesi</h2>
<p>Katman katman dizilmiş mini baklavaların üzerine bir mum — hem görsel hem lezzet şöleni.</p>
<h2>Çikolatalı Sufle</h2>
<p>Bireysel porsiyonlarda servis edilen sıcak sufle, "mutlu yıllar" yazılmış tabakta sunulduğunda unutulmaz bir deneyim yaratır.</p>`,
    coverImage: "/images/blog-5.jpg",
    category: "Tarife İpuçları",
    tags: ["doğum günü", "tatlı", "özel"],
    readingMins: 4,
    publishedAt: "2024-08-28",
    isFeatured: false,
  },
  {
    id: "6",
    slug: "borek-hamurunda-altin-oran",
    title: "Börek Hamurunun Altın Oranı",
    excerpt:
      "Su böreğinden kol böreğine, ev yapımı hamurun sırrı nedir? Gastronomi biliminin böreğe katkısı.",
    content: `<p>Börek, Türk mutfağının taç mücevheridir. Ama güzel börek yapmanın sırrı hamurdadır. Gastronomi bilimi bize hamurun kimyasını anlatır.</p>
<h2>Un Seçimi</h2>
<p>Yufka için protein oranı orta-düşük olan un tercih edin. Yüksek proteinli unlar hamuru sertleştirir ve açmayı zorlaştırır.</p>
<h2>Su Sıcaklığı</h2>
<p>Ilık su (35-40°C) ideal sıcaklıktır. Çok sıcak su gluteni erken aktive eder, çok soğuk su ise hamuru sertleştirir.</p>
<blockquote>Hamurun dinlenmesi en az 30 dakika olmalı. Bu süre glutenin gevşemesi ve hamurun elastik hale gelmesi için kritiktir.</blockquote>`,
    coverImage: "/images/blog-6.jpg",
    category: "Tarife İpuçları",
    tags: ["börek", "hamur", "teknik"],
    readingMins: 7,
    publishedAt: "2024-08-15",
    isFeatured: false,
  },
];

export const blogCategories = [
  "Tüm Yazılar",
  "Tarife İpuçları",
  "Occasion Rehberleri",
  "Malzeme Hikayeleri",
  "Mevsimlik Notlar",
];

import type { StaticPage } from "@/types/page-blocks";

export const staticPages: StaticPage[] = [
  {
    id: "hakkimizda",
    slug: "hakkimizda",
    title: "Hakkımızda",
    metaTitle: "Hakkımızda | Yasemin's Atelier",
    metaDesc: "Yasemin's Atelier hakkında bilgi edinin.",
    blocks: [
      {
        type: "image_text",
        imageSrc: "/images/chef-table.jpg",
        imageAlt: "Yasemin's Atelier Sofrası",
        imagePosition: "right",
        title: "Yasemin's Atelier Hakkında",
        content:
          "İstanbul'un kalbinde, el emeğiyle hazırlanan lezzetler sofralarınıza taşınıyor. 2018 yılından bu yana, gastronomi şefi Yasemin'in öncülüğünde, her özel an için özenle hazırlanan mezeler, börekler ve özel siparişler sunuyoruz.",
      },
      {
        type: "stats",
        items: [
          { value: "500+", label: "Mutlu Sofra" },
          { value: "15+", label: "Yıl Deneyim" },
          { value: "40+", label: "Meze Çeşidi" },
          { value: "5★", label: "Ortalama Puan" },
        ],
      },
      {
        type: "cta",
        title: "Sofralarınızı Birlikte Kuralım",
        subtitle: "Her vesile için özenle hazırlanmış lezzetler.",
        buttonText: "Sipariş Ver",
        buttonHref: "/siparis",
        variant: "primary",
      },
    ],
  },
  {
    id: "sss",
    slug: "sss",
    title: "Sık Sorulan Sorular",
    metaTitle: "SSS | Yasemin's Atelier",
    metaDesc: "Yasemin's Atelier hakkında sıkça sorulan sorular.",
    blocks: [
      {
        type: "faq",
        title: "Merak Ettikleriniz",
        items: [
          {
            question: "Minimum sipariş tutarı nedir?",
            answer: "Minimum sipariş tutarımız 300₺'dir.",
          },
          {
            question: "Teslimat hangi bölgelere yapılıyor?",
            answer:
              "İstanbul'un tüm ilçelerine teslimat yapıyoruz. Teslimat ücreti bölgeye göre değişmektedir.",
          },
          {
            question: "Ne kadar öncesinden sipariş vermem gerekiyor?",
            answer:
              "Standart siparişler için 24 saat, özel siparişler için 48-72 saat önceden sipariş vermenizi öneriyoruz.",
          },
          {
            question: "Allerjen bilgisi alabilir miyim?",
            answer:
              "Tüm ürünlerimizin allerjen bilgisi ürün sayfasında mevcuttur. Ek sorularınız için bize ulaşabilirsiniz.",
          },
          {
            question: "İptal ve iade politikanız nedir?",
            answer:
              "Teslimat saatinden 12 saat öncesine kadar ücretsiz iptal edebilirsiniz. Detaylar için İptal & İade sayfamızı inceleyin.",
          },
        ],
      },
    ],
  },
];

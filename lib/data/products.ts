export interface ProductVariant {
  name: string;
  priceAdd: number;
}

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  basePrice: number;
  categoryId: string;
  occasions: string[];
  images: string[];
  variants: ProductVariant[];
  isVegan: boolean;
  isGlutenFree: boolean;
  isLactoseFree?: boolean;
  isHalal?: boolean;
  allergens: string[];
  isFeatured: boolean;
  requiresCustomOrder?: boolean;
  avgRating: number;
  reviewCount: number;
}

export const products: ProductData[] = [
  {
    id: "1", name: "Klasik Meze Tabağı", slug: "klasik-meze-tabagi",
    shortDesc: "8 çeşit soğuk meze, haydari, patlıcan ezmesi, kalamar ve daha fazlası.",
    basePrice: 280, categoryId: "soguk-mezeler",
    occasions: ["MISAFIR_AGIRMA", "IS_YEMEGI"],
    images: [
      "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&q=80",
      "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80",
      "https://images.unsplash.com/photo-1626203385290-65816e690a94?w=800&q=80",
      "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=800&q=80",
    ],
    variants: [
      { name: "2 Kişilik", priceAdd: 0 }, { name: "4 Kişilik", priceAdd: 120 }, { name: "8 Kişilik", priceAdd: 280 },
    ],
    isVegan: false, isGlutenFree: false, allergens: ["süt", "yumurta"],
    isFeatured: true, avgRating: 4.9, reviewCount: 47,
  },
  {
    id: "2", name: "Ev Yapımı Su Böreği", slug: "ev-yapimi-su-boregi",
    shortDesc: "İnce yufka, peynirli veya kıymalı. El açması, fırında.",
    basePrice: 320, categoryId: "su-boregi",
    occasions: ["MISAFIR_AGIRMA", "IS_YEMEGI", "KAHVALTI"],
    images: [
      "https://images.unsplash.com/photo-1628735090933-82e21a951dfa?w=800&q=80",
      "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=800&q=80",
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
    ],
    variants: [
      { name: "Küçük Tepsi (4-6 kişi)", priceAdd: 0 }, { name: "Büyük Tepsi (8-12 kişi)", priceAdd: 180 },
    ],
    isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"],
    isFeatured: true, avgRating: 4.8, reviewCount: 62,
  },
  {
    id: "3", name: "Misafir Ağırlama Seti", slug: "misafir-agirma-seti",
    shortDesc: "4 meze + 1 börek + 1 tatlı. 8 kişilik tam sofra seti.",
    basePrice: 680, categoryId: "hediye-kutulari",
    occasions: ["MISAFIR_AGIRMA"],
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      "https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=800&q=80",
    ],
    variants: [
      { name: "8 Kişilik", priceAdd: 0 }, { name: "12 Kişilik", priceAdd: 240 },
    ],
    isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"],
    isFeatured: true, avgRating: 5.0, reviewCount: 28,
  },
  {
    id: "4", name: "Baklava Çeşitleri", slug: "baklava-cesitleri",
    shortDesc: "Antep fıstıklı, cevizli ve sütlü baklava karışık tabak.",
    basePrice: 240, categoryId: "turk-tatlilar",
    occasions: ["DOGUM_GUNU", "MISAFIR_AGIRMA", "MEVSIMSEL"],
    images: [
      "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=800&q=80",
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=80",
      "https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&q=80",
    ],
    variants: [
      { name: "500g", priceAdd: 0 }, { name: "1kg", priceAdd: 220 },
    ],
    isVegan: false, isGlutenFree: false, allergens: ["gluten", "fıstık", "ceviz"],
    isFeatured: false, avgRating: 4.9, reviewCount: 83,
  },
  {
    id: "5", name: "Mini Finger Food Seti", slug: "mini-finger-food-seti",
    shortDesc: "20 çeşit tek ısırımlık kanepe ve finger food. Parti için ideal.",
    basePrice: 380, categoryId: "kanepe",
    occasions: ["KADIN_GUNLERI", "EV_PARTISI", "IS_YEMEGI"],
    images: [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
    ],
    variants: [
      { name: "20 Adet", priceAdd: 0 }, { name: "40 Adet", priceAdd: 340 }, { name: "60 Adet", priceAdd: 640 },
    ],
    isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt"],
    isFeatured: true, avgRating: 4.7, reviewCount: 35,
  },
  {
    id: "6", name: "Özel Doğum Günü Keki", slug: "ozel-dogum-gunu-keki",
    shortDesc: "Kişiselleştirilmiş tasarım, seçilen krem ve kat sayısı.",
    basePrice: 450, categoryId: "ozel-kekler",
    occasions: ["DOGUM_GUNU"], requiresCustomOrder: true,
    images: [
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80",
      "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80",
    ],
    variants: [
      { name: "10 Dilim", priceAdd: 0 }, { name: "16 Dilim", priceAdd: 150 }, { name: "24 Dilim", priceAdd: 280 },
    ],
    isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"],
    isFeatured: false, avgRating: 5.0, reviewCount: 19,
  },
  {
    id: "7", name: "Acılı Ezme & Humus Tabağı", slug: "acili-ezme-humus-tabagi",
    shortDesc: "Ev yapımı acılı ezme, humus ve tahin sosu. Lavaş eşliğinde.",
    basePrice: 160, categoryId: "soguk-mezeler",
    occasions: ["MISAFIR_AGIRMA", "IS_YEMEGI", "KADIN_GUNLERI"],
    images: [
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=800&q=80",
      "https://images.unsplash.com/photo-1547516508-a2991b713115?w=800&q=80",
      "https://images.unsplash.com/photo-1643640076993-dec43673de69?w=800&q=80",
    ],
    variants: [
      { name: "2-3 Kişilik", priceAdd: 0 }, { name: "5-6 Kişilik", priceAdd: 100 },
    ],
    isVegan: true, isGlutenFree: true, allergens: ["susam"],
    isFeatured: false, avgRating: 4.8, reviewCount: 54,
  },
  {
    id: "8", name: "Premium Hediye Kutusu", slug: "premium-hediye-kutusu",
    shortDesc: "Özel tasarım kutuda 6 çeşit el yapımı ürün. En anlamlı hediye.",
    basePrice: 480, categoryId: "premium-hediye",
    occasions: ["KURUMSAL_HEDIYE", "DOGUM_GUNU", "MEVSIMSEL"],
    images: [
      "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=800&q=80",
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800&q=80",
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
    ],
    variants: [
      { name: "Standart", priceAdd: 0 }, { name: "Premium (markalı kutu)", priceAdd: 80 },
    ],
    isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "fıstık"],
    isFeatured: false, avgRating: 4.9, reviewCount: 22,
  },
  {
    id: "9", name: "Dolma Çeşitleri", slug: "dolma-cesitleri",
    shortDesc: "Zeytinyağlı yaprak sarma ve biber dolması.",
    basePrice: 180, categoryId: "soguk-mezeler", occasions: ["MISAFIR_AGIRMA"],
    images: [
      "https://images.unsplash.com/photo-1619683548293-0e78baf0e389?w=800&q=80",
      "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800&q=80",
      "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?w=800&q=80",
    ],
    variants: [{ name: "20 Adet", priceAdd: 0 }, { name: "40 Adet", priceAdd: 160 }],
    isVegan: true, isGlutenFree: true, allergens: [], isFeatured: false, avgRating: 4.7, reviewCount: 41,
  },
  {
    id: "10", name: "Ramazan Özel Seti", slug: "ramazan-ozel-seti",
    shortDesc: "İftar sofrası için özel hazırlanmış set.",
    basePrice: 520, categoryId: "hediye-kutulari", occasions: ["MEVSIMSEL"],
    images: [
      "https://images.unsplash.com/photo-1530469912745-a215c6b256ea?w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&q=80",
    ],
    variants: [{ name: "4 Kişilik", priceAdd: 0 }, { name: "8 Kişilik", priceAdd: 420 }],
    isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt"],
    isFeatured: false, avgRating: 5.0, reviewCount: 14,
  },
  {
    id: "11", name: "Kurumsal Hediye Seti", slug: "kurumsal-hediye-seti",
    shortDesc: "Logo baskılı kutuda özel ürün seçkisi.",
    basePrice: 380, categoryId: "kurumsal-hediye-k", occasions: ["KURUMSAL_HEDIYE"],
    images: [
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
      "https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?w=800&q=80",
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800&q=80",
    ],
    variants: [{ name: "Standart Set", priceAdd: 0 }],
    isVegan: false, isGlutenFree: false, allergens: ["gluten"],
    isFeatured: false, avgRating: 4.8, reviewCount: 9,
  },
  {
    id: "12", name: "Kahvaltı Sepeti", slug: "kahvalti-sepeti",
    shortDesc: "Reçel, peynir, zeytin, börek ve poğaça.",
    basePrice: 290, categoryId: "kahvalti-setleri", occasions: ["KAHVALTI"],
    images: [
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80",
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80",
    ],
    variants: [{ name: "2 Kişilik", priceAdd: 0 }, { name: "4 Kişilik", priceAdd: 180 }],
    isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt"],
    isFeatured: false, avgRating: 4.9, reviewCount: 33,
  },
  {
    id: "13", name: "Ev Yapımı Reçel Seti", slug: "ev-yapimi-recel-seti",
    shortDesc: "3 çeşit mevsimlik meyve reçeli.",
    basePrice: 120, categoryId: "kahvalti-setleri", occasions: ["KAHVALTI", "KURUMSAL_HEDIYE"],
    images: [
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80",
      "https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?w=800&q=80",
      "https://images.unsplash.com/photo-1597225244660-1cd128c64284?w=800&q=80",
    ],
    variants: [{ name: "3'lü Set", priceAdd: 0 }, { name: "6'lı Set", priceAdd: 100 }],
    isVegan: true, isGlutenFree: true, allergens: [], isFeatured: false, avgRating: 4.6, reviewCount: 28,
  },
  {
    id: "14", name: "Açık Büfe Kahvaltı Seti", slug: "acik-bufe-kahvalti-seti",
    shortDesc: "10 kişilik tam kahvaltı sofrası.",
    basePrice: 680, categoryId: "kahvalti-setleri", occasions: ["KAHVALTI", "EV_PARTISI"],
    images: [
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80",
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80",
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80",
    ],
    variants: [{ name: "10 Kişilik", priceAdd: 0 }, { name: "20 Kişilik", priceAdd: 580 }],
    isVegan: false, isGlutenFree: false, allergens: ["gluten", "süt", "yumurta"],
    isFeatured: false, avgRating: 4.9, reviewCount: 17,
  },
  {
    id: "15", name: "Vegan Meze Tabağı", slug: "vegan-meze-tabagi",
    shortDesc: "Tamamen bitkisel, 6 çeşit meze.",
    basePrice: 220, categoryId: "soguk-mezeler", occasions: ["SAGLIKLI", "MISAFIR_AGIRMA"],
    images: [
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
      "https://images.unsplash.com/photo-1540914124281-342587941389?w=800&q=80",
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&q=80",
    ],
    variants: [{ name: "2 Kişilik", priceAdd: 0 }, { name: "4 Kişilik", priceAdd: 100 }],
    isVegan: true, isGlutenFree: true, allergens: [], isFeatured: false, avgRating: 4.7, reviewCount: 21,
  },
  {
    id: "16", name: "Protein Salata Seti", slug: "protein-salata-seti",
    shortDesc: "Izgara tavuklu, kinoa ve taze sebzeli özel salata.",
    basePrice: 180, categoryId: "salata-setleri", occasions: ["SAGLIKLI"],
    images: [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
      "https://images.unsplash.com/photo-1505576399279-0d309fade01e?w=800&q=80",
      "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&q=80",
    ],
    variants: [{ name: "1 Porsiyon", priceAdd: 0 }, { name: "2 Porsiyon", priceAdd: 160 }],
    isVegan: false, isGlutenFree: true, allergens: [], isFeatured: false, avgRating: 4.5, reviewCount: 12,
  },
  {
    id: "17", name: "Glutensiz Börek", slug: "glutensiz-borek",
    shortDesc: "Glutensiz una özel hazırlanmış, peynirli iç harçlı börek.",
    basePrice: 280, categoryId: "mini-borekler", occasions: ["SAGLIKLI", "KADIN_GUNLERI"],
    images: [
      "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=80",
      "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=800&q=80",
      "https://images.unsplash.com/photo-1628735090933-82e21a951dfa?w=800&q=80",
    ],
    variants: [{ name: "6 Adet", priceAdd: 0 }, { name: "12 Adet", priceAdd: 240 }],
    isVegan: false, isGlutenFree: true, allergens: ["süt", "yumurta"],
    isFeatured: false, avgRating: 4.6, reviewCount: 8,
  },
];

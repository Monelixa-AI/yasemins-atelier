export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
}

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  productCount: number;
  children: SubCategory[];
}

export const categories: CategoryData[] = [
  {
    id: "mezeler", name: "Mezeler", slug: "mezeler",
    description: "Soğuk ve sıcak meze çeşitlerimiz",
    imageUrl: "/images/categories/mezeler.jpg", productCount: 18,
    children: [
      { id: "soguk-mezeler", name: "Soğuk Mezeler", slug: "soguk-mezeler", parentId: "mezeler" },
      { id: "sicak-mezeler", name: "Sıcak Mezeler", slug: "sicak-mezeler", parentId: "mezeler" },
      { id: "deniz-urunlu", name: "Deniz Ürünlü", slug: "deniz-urunlu-mezeler", parentId: "mezeler" },
    ],
  },
  {
    id: "borekler", name: "Börekler & Hamurlar", slug: "borekler",
    description: "El açması börek çeşitlerimiz",
    imageUrl: "/images/categories/borekler.jpg", productCount: 8,
    children: [
      { id: "su-boregi", name: "Su Böreği", slug: "su-boregi", parentId: "borekler" },
      { id: "kol-boregi", name: "Kol Böreği", slug: "kol-boregi", parentId: "borekler" },
      { id: "mini-borekler", name: "Mini Börekler", slug: "mini-borekler", parentId: "borekler" },
    ],
  },
  {
    id: "tatlilar", name: "Kek & Tatlılar", slug: "tatlilar",
    description: "Özel sipariş kekler ve tatlılar",
    imageUrl: "/images/categories/tatlilar.jpg", productCount: 12,
    children: [
      { id: "ozel-kekler", name: "Özel Kekler", slug: "ozel-kekler", parentId: "tatlilar" },
      { id: "turk-tatlilar", name: "Türk Tatlıları", slug: "turk-tatlilar", parentId: "tatlilar" },
      { id: "uluslararasi", name: "Uluslararası", slug: "uluslararasi-tatlilar", parentId: "tatlilar" },
    ],
  },
  {
    id: "kanepe", name: "Kanepe & Finger Food", slug: "kanepe",
    description: "Kokteyl ve etkinlikler için",
    imageUrl: "/images/categories/kanepe.jpg", productCount: 10,
    children: [],
  },
  {
    id: "ana-yemekler", name: "Ana Yemekler", slug: "ana-yemekler",
    description: "Sıcak servis ana yemekler",
    imageUrl: "/images/categories/ana-yemekler.jpg", productCount: 9,
    children: [
      { id: "et-yemekleri", name: "Et", slug: "et-yemekleri", parentId: "ana-yemekler" },
      { id: "tavuk", name: "Tavuk", slug: "tavuk-yemekleri", parentId: "ana-yemekler" },
      { id: "deniz-urunleri", name: "Deniz Ürünleri", slug: "deniz-urunleri", parentId: "ana-yemekler" },
    ],
  },
  {
    id: "kahvalti-setleri", name: "Kahvaltı Setleri", slug: "kahvalti-setleri",
    description: "Hafta sonu kahvaltı sofrası",
    imageUrl: "/images/categories/kahvalti.jpg", productCount: 6,
    children: [],
  },
  {
    id: "salata-setleri", name: "Salata Setleri", slug: "salata-setleri",
    description: "Taze ve mevsimlik salatalar",
    imageUrl: "/images/categories/salatalar.jpg", productCount: 7,
    children: [],
  },
  {
    id: "hediye-kutulari", name: "Hediye Kutuları", slug: "hediye-kutulari",
    description: "Özel günler için hazır setler",
    imageUrl: "/images/categories/hediye.jpg", productCount: 8,
    children: [
      { id: "standart-hediye", name: "Standart", slug: "standart-hediye", parentId: "hediye-kutulari" },
      { id: "premium-hediye", name: "Premium", slug: "premium-hediye", parentId: "hediye-kutulari" },
      { id: "kurumsal-hediye-k", name: "Kurumsal", slug: "kurumsal-hediye-kutu", parentId: "hediye-kutulari" },
    ],
  },
];

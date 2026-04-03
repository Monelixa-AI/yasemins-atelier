export interface BundleItem {
  productId: string;
  variantName: string;
  qty: number;
}

export interface BundleData {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: number;
  normalPrice: number;
  saving: number;
  isActive: boolean;
  items: BundleItem[];
}

export const bundles: BundleData[] = [
  {
    id: "bundle-1",
    name: "Misafir Ağırlama Paketi",
    slug: "misafir-agirma-paketi",
    description: "4 kişilik eksiksiz sofra: 3 meze + 1 börek + 1 tatlı",
    imageUrl: "/images/bundles/misafir.jpg",
    price: 580,
    normalPrice: 680,
    saving: 100,
    isActive: true,
    items: [
      { productId: "1", variantName: "4 Kişilik", qty: 1 },
      { productId: "7", variantName: "5-6 Kişilik", qty: 1 },
      { productId: "9", variantName: "20 Adet", qty: 1 },
      { productId: "2", variantName: "Küçük Tepsi", qty: 1 },
      { productId: "4", variantName: "500g", qty: 1 },
    ],
  },
  {
    id: "bundle-2",
    name: "Kadın Günü Paketi",
    slug: "kadin-gunu-paketi",
    description: "10 kişilik özel gün seti: finger food + tatlı + kahve ikramı",
    imageUrl: "/images/bundles/kadin.jpg",
    price: 680,
    normalPrice: 820,
    saving: 140,
    isActive: true,
    items: [
      { productId: "5", variantName: "20 Adet", qty: 1 },
      { productId: "4", variantName: "500g", qty: 1 },
      { productId: "8", variantName: "Standart", qty: 1 },
    ],
  },
  {
    id: "bundle-3",
    name: "İş Yemeği Paketi",
    slug: "is-yemegi-paketi",
    description: "6-8 kişilik profesyonel sunum: sofistike meze + börek seti",
    imageUrl: "/images/bundles/is.jpg",
    price: 780,
    normalPrice: 920,
    saving: 140,
    isActive: true,
    items: [
      { productId: "1", variantName: "8 Kişilik", qty: 1 },
      { productId: "7", variantName: "5-6 Kişilik", qty: 1 },
      { productId: "2", variantName: "Küçük Tepsi", qty: 1 },
    ],
  },
];

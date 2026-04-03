export const DELIVERY_ZONES = {
  freshDelivery: {
    label: "Taze Ürün Teslimatı",
    districts: ["Kadıköy", "Ataşehir"],
    description: "Taze hazırlanan ürünlerimiz şimdilik sadece Kadıköy ve Ataşehir'e teslim edilmektedir.",
    icon: "🏍️",
  },
  services: {
    label: "Özel Hizmetler",
    coverage: "Tüm İstanbul",
    description: "Eve Şef, Workshop ve diğer hizmetlerimiz İstanbul genelinde sunulmaktadır.",
    icon: "👩‍🍳",
  },
  naturelCargo: {
    label: "Naturel Kargo",
    coverage: "Türkiye Geneli",
    description: "Paketli Naturel ürünlerimiz Türkiye'nin her yerine kargo ile gönderilir.",
    freeThreshold: 750,
    icon: "📦",
  },
} as const;

export const ISTANBUL_DISTRICTS = [
  "Kadıköy", "Ataşehir", "Üsküdar", "Beşiktaş", "Şişli", "Beyoğlu",
  "Maltepe", "Kartal", "Pendik", "Ümraniye", "Fatih", "Bakırköy",
  "Sarıyer", "Beykoz", "Bağcılar", "Bahçelievler", "Bayrampaşa",
  "Eyüpsultan", "Gaziosmanpaşa", "Kağıthane", "Küçükçekmece",
  "Sultanbeyli", "Tuzla", "Zeytinburnu",
];

export const FRESH_DELIVERY_DISTRICTS = ["Kadıköy", "Ataşehir"];

export function isFreshDeliveryAvailable(district: string): boolean {
  return FRESH_DELIVERY_DISTRICTS.includes(district);
}

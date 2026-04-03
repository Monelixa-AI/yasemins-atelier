export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  estimatedDays: string;
  price: number;
  freeThreshold: number | null;
}

export function calculateShipping(weightGrams: number, city: string, subtotal: number): ShippingOption[] {
  const isIstanbul = city.toLowerCase().includes("istanbul") || city.toLowerCase().includes("İstanbul");

  if (isIstanbul) {
    return [
      { id: "istanbul-delivery", name: "İstanbul Kurye Teslimatı", carrier: "Özel Kurye", estimatedDays: "Aynı gün / Ertesi gün", price: subtotal >= 500 ? 0 : 50, freeThreshold: 500 },
      { id: "standard-cargo", name: "Standart Kargo", carrier: "Yurtiçi Kargo", estimatedDays: "1-2 iş günü", price: subtotal >= 600 ? 0 : 39, freeThreshold: 600 },
    ];
  }

  let cargoPrice = 49;
  if (weightGrams > 2000) cargoPrice = 69;
  if (weightGrams > 5000) cargoPrice = 99;

  return [
    { id: "standard-cargo", name: "Standart Kargo", carrier: "Yurtiçi Kargo", estimatedDays: "2-3 iş günü", price: subtotal >= 750 ? 0 : cargoPrice, freeThreshold: 750 },
    { id: "express-cargo", name: "Hızlı Kargo", carrier: "Aras Kargo", estimatedDays: "1-2 iş günü", price: cargoPrice + 25, freeThreshold: null },
  ];
}

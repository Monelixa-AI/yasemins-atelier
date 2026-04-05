import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

interface EffectivePrice {
  price: number;
  originalPrice?: number;
  isFlashSale: boolean;
}

/**
 * Get the effective price for a product, checking for active flash sales.
 * If a flash sale is active and includes this product, the discounted price is returned.
 */
export async function getEffectivePrice(
  productId: string,
  basePrice: number | Decimal
): Promise<EffectivePrice> {
  const now = new Date();
  const base = typeof basePrice === "number" ? basePrice : Number(basePrice);

  // Find an active flash sale that includes this product
  const flashSaleProduct = await prisma.flashSaleProduct.findFirst({
    where: {
      productId,
      flashSale: {
        isActive: true,
        startAt: { lte: now },
        endAt: { gte: now },
      },
    },
    include: {
      flashSale: true,
    },
  });

  if (!flashSaleProduct) {
    return { price: base, isFlashSale: false };
  }

  // Check stock limit
  if (
    flashSaleProduct.maxQuantity !== null &&
    flashSaleProduct.soldCount >= flashSaleProduct.maxQuantity
  ) {
    return { price: base, isFlashSale: false };
  }

  // Calculate discounted price
  const discountValue = Number(flashSaleProduct.discountValue);
  let discountedPrice: number;

  switch (flashSaleProduct.discountType) {
    case "PERCENTAGE":
      discountedPrice = base * (1 - discountValue / 100);
      break;
    case "FIXED_AMOUNT":
      discountedPrice = base - discountValue;
      break;
    default:
      discountedPrice = base;
  }

  // Ensure price doesn't go below 0
  discountedPrice = Math.max(0, Math.round(discountedPrice * 100) / 100);

  return {
    price: discountedPrice,
    originalPrice: base,
    isFlashSale: true,
  };
}

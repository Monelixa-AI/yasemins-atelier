import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

interface CategoryRule {
  categoryId: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
}

interface CorporatePriceResult {
  price: number;
  originalPrice: number;
  discountApplied: boolean;
  discountInfo?: {
    type: "PERCENTAGE" | "FIXED_AMOUNT";
    value: number;
    groupName: string;
  };
}

export async function getCorporatePrice(
  productId: string,
  basePrice: number | Decimal,
  corporateAccountId: string
): Promise<CorporatePriceResult> {
  const original = typeof basePrice === "number" ? basePrice : Number(basePrice);

  const account = await prisma.corporateAccount.findUnique({
    where: { id: corporateAccountId },
    include: { priceGroup: true },
  });

  if (!account || !account.priceGroup) {
    return { price: original, originalPrice: original, discountApplied: false };
  }

  const group = account.priceGroup;

  // Check category-specific overrides
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryId: true },
  });

  const rules = (group.categoryRules as unknown as CategoryRule[]) || [];
  const categoryRule = product?.categoryId
    ? rules.find((r) => r.categoryId === product.categoryId)
    : undefined;

  const discountType = categoryRule?.discountType ?? group.discountType;
  const discountValue = categoryRule?.discountValue ?? Number(group.discountValue);

  let price: number;
  if (discountType === "PERCENTAGE") {
    price = original * (1 - discountValue / 100);
  } else {
    price = Math.max(0, original - discountValue);
  }

  price = Math.round(price * 100) / 100;

  return {
    price,
    originalPrice: original,
    discountApplied: true,
    discountInfo: {
      type: discountType as "PERCENTAGE" | "FIXED_AMOUNT",
      value: discountValue,
      groupName: group.name,
    },
  };
}

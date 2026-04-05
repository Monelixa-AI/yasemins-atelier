import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCorporatePrice } from "@/lib/corporate-pricing";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const corporateAccountId = searchParams.get("corporateAccountId");

    const products = await prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { id: true, name: true, slug: true } },
        variants: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    if (!corporateAccountId) {
      return NextResponse.json({ products });
    }

    const productsWithPricing = await Promise.all(
      products.map(async (product) => {
        const corporatePrice = await getCorporatePrice(
          product.id,
          product.basePrice,
          corporateAccountId
        );
        return { ...product, corporatePrice };
      })
    );

    return NextResponse.json({ products: productsWithPricing });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

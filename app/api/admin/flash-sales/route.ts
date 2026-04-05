import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const flashSales = await prisma.flashSale.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(flashSales);
  } catch (error) {
    console.error("Flash sales list API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch flash sales" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products, ...saleData } = body;

    const flashSale = await prisma.flashSale.create({
      data: {
        ...saleData,
        ...(products && products.length > 0
          ? {
              products: {
                create: products.map(
                  (p: {
                    productId: string;
                    discountType: string;
                    discountValue: number;
                    maxQuantity?: number;
                  }) => ({
                    productId: p.productId,
                    discountType: p.discountType,
                    discountValue: p.discountValue,
                    maxQuantity: p.maxQuantity ?? null,
                  })
                ),
              },
            }
          : {}),
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(flashSale, { status: 201 });
  } catch (error) {
    console.error("Flash sale create API error:", error);
    return NextResponse.json(
      { error: "Failed to create flash sale" },
      { status: 500 }
    );
  }
}

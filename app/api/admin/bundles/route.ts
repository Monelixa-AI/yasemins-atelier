import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bundles = await prisma.bundle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, basePrice: true },
            },
          },
        },
      },
    });

    return NextResponse.json(bundles);
  } catch (error) {
    console.error("Bundles list API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bundles" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, ...bundleData } = body;

    const bundle = await prisma.bundle.create({
      data: {
        ...bundleData,
        ...(items && items.length > 0
          ? {
              items: {
                create: items.map(
                  (item: { productId: string; quantity?: number; variantId?: string }) => ({
                    productId: item.productId,
                    quantity: item.quantity || 1,
                    variantId: item.variantId || null,
                  })
                ),
              },
            }
          : {}),
      },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, basePrice: true },
            },
          },
        },
      },
    });

    return NextResponse.json(bundle, { status: 201 });
  } catch (error) {
    console.error("Bundle create API error:", error);
    return NextResponse.json(
      { error: "Failed to create bundle" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json(collections);
  } catch (error) {
    console.error("Collections list API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productIds, ...collectionData } = body;

    const collection = await prisma.collection.create({
      data: {
        ...collectionData,
        ...(productIds && productIds.length > 0
          ? {
              products: {
                create: productIds.map((productId: string, index: number) => ({
                  productId,
                  sortOrder: index,
                })),
              },
            }
          : {}),
      },
      include: {
        products: { include: { product: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    console.error("Collection create API error:", error);
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 }
    );
  }
}

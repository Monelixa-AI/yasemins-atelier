import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { productIds, ...collectionData } = body;

    const existing = await prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    // If productIds are provided, replace all product associations
    if (productIds !== undefined) {
      await prisma.collectionProduct.deleteMany({ where: { collectionId: id } });
      if (productIds.length > 0) {
        await prisma.collectionProduct.createMany({
          data: productIds.map((productId: string, index: number) => ({
            collectionId: id,
            productId,
            sortOrder: index,
          })),
        });
      }
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: collectionData,
      include: {
        products: { include: { product: true } },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Collection update API error:", error);
    return NextResponse.json(
      { error: "Failed to update collection" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existing = await prisma.collection.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    await prisma.collection.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Collection delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete collection" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { items, ...bundleData } = body;

    const existing = await prisma.bundle.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    // If items are provided, replace all bundle items
    if (items !== undefined) {
      await prisma.bundleItem.deleteMany({ where: { bundleId: id } });
      if (items.length > 0) {
        await prisma.bundleItem.createMany({
          data: items.map(
            (item: { productId: string; quantity?: number; variantId?: string }) => ({
              bundleId: id,
              productId: item.productId,
              quantity: item.quantity || 1,
              variantId: item.variantId || null,
            })
          ),
        });
      }
    }

    const bundle = await prisma.bundle.update({
      where: { id },
      data: bundleData,
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

    return NextResponse.json(bundle);
  } catch (error) {
    console.error("Bundle update API error:", error);
    return NextResponse.json(
      { error: "Failed to update bundle" },
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

    const existing = await prisma.bundle.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    await prisma.bundle.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bundle delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete bundle" },
      { status: 500 }
    );
  }
}

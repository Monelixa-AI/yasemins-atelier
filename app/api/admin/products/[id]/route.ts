import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        variants: { orderBy: { sortOrder: "asc" } },
        occasions: { include: { occasion: true } },
        collections: { include: { collection: true } },
        bundleItems: { include: { bundle: true } },
        reviews: { orderBy: { createdAt: "desc" }, take: 10 },
        stockMovements: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: body,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
        variants: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product update API error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
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

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Soft delete: set status to INACTIVE
    const product = await prisma.product.update({
      where: { id },
      data: { status: "INACTIVE" },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

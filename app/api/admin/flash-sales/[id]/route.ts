import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existing = await prisma.flashSale.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    const flashSale = await prisma.flashSale.update({
      where: { id },
      data: body,
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

    return NextResponse.json(flashSale);
  } catch (error) {
    console.error("Flash sale update API error:", error);
    return NextResponse.json(
      { error: "Failed to update flash sale" },
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

    const existing = await prisma.flashSale.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Flash sale not found" },
        { status: 404 }
      );
    }

    await prisma.flashSale.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Flash sale delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete flash sale" },
      { status: 500 }
    );
  }
}

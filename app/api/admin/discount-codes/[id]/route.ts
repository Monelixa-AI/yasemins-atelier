import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existing = await prisma.discountCode.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Discount code not found" }, { status: 404 });
    }

    // Support toggling isActive or updating any fields
    const code = await prisma.discountCode.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(code);
  } catch (error) {
    console.error("Discount code update API error:", error);
    return NextResponse.json(
      { error: "Failed to update discount code" },
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

    const existing = await prisma.discountCode.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Discount code not found" }, { status: 404 });
    }

    await prisma.discountCode.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Discount code delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete discount code" },
      { status: 500 }
    );
  }
}

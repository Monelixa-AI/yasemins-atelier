import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const block = await prisma.loyaltyRedemptionBlock.update({
      where: { id },
      data: { unblockedAt: new Date() },
    });

    return NextResponse.json(block);
  } catch (error) {
    console.error("Loyalty block DELETE error:", error);
    return NextResponse.json(
      { error: "Engel kaldirilamadi" },
      { status: 500 }
    );
  }
}

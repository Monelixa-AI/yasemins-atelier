import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const blocks = await prisma.loyaltyRedemptionBlock.findMany({
      where: { unblockedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blocks);
  } catch (error) {
    console.error("Loyalty blocks GET error:", error);
    return NextResponse.json(
      { error: "Engeller alinamadi" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, reason, blockedBy } = body;

    if (!reason || !blockedBy) {
      return NextResponse.json(
        { error: "reason ve blockedBy zorunludur" },
        { status: 400 }
      );
    }

    const block = await prisma.loyaltyRedemptionBlock.create({
      data: {
        userId: userId ?? null,
        reason,
        blockedBy,
      },
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error("Loyalty blocks POST error:", error);
    return NextResponse.json(
      { error: "Engel olusturulamadi" },
      { status: 500 }
    );
  }
}

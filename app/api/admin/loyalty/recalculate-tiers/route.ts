import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { checkAndUpdateTier } from "@/lib/loyalty";

export async function POST() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    let updated = 0;

    for (const user of users) {
      const before = await prisma.user.findUnique({
        where: { id: user.id },
        select: { loyaltyTier: true },
      });

      await checkAndUpdateTier(user.id);

      const after = await prisma.user.findUnique({
        where: { id: user.id },
        select: { loyaltyTier: true },
      });

      if (before?.loyaltyTier !== after?.loyaltyTier) {
        updated++;
      }
    }

    return NextResponse.json({ updated, total: users.length });
  } catch (error) {
    console.error("Recalculate tiers POST error:", error);
    return NextResponse.json(
      { error: "Kademeler yeniden hesaplanamadi" },
      { status: 500 }
    );
  }
}

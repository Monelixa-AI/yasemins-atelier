import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/loyalty";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, points, type, description } = body;

    if (!userId || points === undefined || !type || !description) {
      return NextResponse.json(
        { error: "userId, points, type ve description zorunludur" },
        { status: 400 }
      );
    }

    if (points > 0) {
      await awardPoints(userId, points, type, description);
    } else if (points < 0) {
      // Negative manual adjustment - bypass redeem logic
      await prisma.$transaction([
        prisma.loyaltyTransaction.create({
          data: {
            userId,
            points,
            type,
            description,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { loyaltyPoints: { increment: points } },
        }),
      ]);
    } else {
      return NextResponse.json(
        { error: "points 0 olamaz" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true, loyaltyTier: true },
    });

    return NextResponse.json({
      ok: true,
      points,
      currentBalance: user?.loyaltyPoints ?? 0,
      tier: user?.loyaltyTier ?? "BRONZE",
    });
  } catch (error) {
    console.error("Manual transaction POST error:", error);
    return NextResponse.json(
      { error: "Manuel islem olusturulamadi" },
      { status: 500 }
    );
  }
}

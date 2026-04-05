import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getLoyaltyConfig } from "@/lib/loyalty";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parametresi zorunludur" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, loyaltyPoints: true, loyaltyTier: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanici bulunamadi" },
        { status: 404 }
      );
    }

    const config = await getLoyaltyConfig();

    // Last 20 transactions
    const transactions = await prisma.loyaltyTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // Expiring points (sum of points with expiresAt in the future, not expired)
    const now = new Date();
    const expiringResult = await prisma.loyaltyTransaction.aggregate({
      where: {
        userId,
        expiresAt: { gte: now },
        type: { not: "EXPIRED" },
        points: { gt: 0 },
      },
      _sum: { points: true },
    });

    // Public config subset
    const publicConfig = {
      programName: config.programName,
      programDescription: config.programDescription,
      isActive: config.isActive,
      pointsToTLRate: config.pointsToTLRate,
      spendPerPoints: config.spendPerPoints,
      minPointsToRedeem: config.minPointsToRedeem,
      maxRedeemPercent: config.maxRedeemPercent,
      tiersEnabled: config.tiersEnabled,
      bronzeMin: config.bronzeMin,
      silverMin: config.silverMin,
      goldMin: config.goldMin,
      bronzeBenefits: config.bronzeBenefits,
      silverBenefits: config.silverBenefits,
      goldBenefits: config.goldBenefits,
      showPointsOnSite: config.showPointsOnSite,
      showTiersOnSite: config.showTiersOnSite,
      showLeaderboard: config.showLeaderboard,
    };

    return NextResponse.json({
      points: user.loyaltyPoints,
      tier: user.loyaltyTier,
      config: publicConfig,
      transactions,
      expiringPoints: expiringResult._sum.points ?? 0,
    });
  } catch (error) {
    console.error("User loyalty GET error:", error);
    return NextResponse.json(
      { error: "Sadakat bilgileri alinamadi" },
      { status: 500 }
    );
  }
}

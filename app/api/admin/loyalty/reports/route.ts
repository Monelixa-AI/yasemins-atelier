import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const in30Days = new Date();
    in30Days.setDate(in30Days.getDate() + 30);

    // Total awarded this month (positive points)
    const awardedResult = await prisma.loyaltyTransaction.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        points: { gt: 0 },
        type: { not: "EXPIRED" },
      },
      _sum: { points: true },
    });

    // Total redeemed this month (negative points)
    const redeemedResult = await prisma.loyaltyTransaction.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        points: { lt: 0 },
      },
      _sum: { points: true },
    });

    // Tier distribution
    const [bronzeCount, silverCount, goldCount] = await Promise.all([
      prisma.user.count({ where: { loyaltyTier: "BRONZE" } }),
      prisma.user.count({ where: { loyaltyTier: "SILVER" } }),
      prisma.user.count({ where: { loyaltyTier: "GOLD" } }),
    ]);

    // Expiring in 30 days
    const expiringResult = await prisma.loyaltyTransaction.aggregate({
      where: {
        expiresAt: { lte: in30Days, gte: now },
        type: { not: "EXPIRED" },
        points: { gt: 0 },
      },
      _sum: { points: true },
    });

    return NextResponse.json({
      totalAwarded: awardedResult._sum.points ?? 0,
      totalRedeemed: Math.abs(redeemedResult._sum.points ?? 0),
      tierDistribution: {
        BRONZE: bronzeCount,
        SILVER: silverCount,
        GOLD: goldCount,
      },
      expiringIn30Days: expiringResult._sum.points ?? 0,
    });
  } catch (error) {
    console.error("Loyalty reports GET error:", error);
    return NextResponse.json(
      { error: "Rapor alinamadi" },
      { status: 500 }
    );
  }
}

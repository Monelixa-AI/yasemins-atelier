import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // TODO: Wire up auth — for now return empty structure
    // const session = await getSession();
    // if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = null; // placeholder until auth is wired

    if (!userId) {
      return NextResponse.json({
        referralCode: null,
        referrals: [],
        totalEarned: 0,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        referralCode: true,
        referralsMade: {
          select: {
            id: true,
            referredEmail: true,
            status: true,
            referrerReward: true,
            convertedAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const totalEarned = user.referralsMade.reduce(
      (sum, r) => sum + r.referrerReward,
      0
    );

    return NextResponse.json({
      referralCode: user.referralCode,
      referrals: user.referralsMade,
      totalEarned,
    });
  } catch (error) {
    console.error("Referrals API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();

    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [{ validFrom: null }, { validFrom: { lte: now } }],
        AND: [
          { OR: [{ validUntil: null }, { validUntil: { gte: now } }] },
        ],
      },
      orderBy: { priority: "desc" },
    });

    return NextResponse.json({ banners });
  } catch {
    return NextResponse.json({ error: "Banner verisi alinamadi" }, { status: 500 });
  }
}

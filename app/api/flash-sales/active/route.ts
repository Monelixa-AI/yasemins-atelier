import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();

    const flashSale = await prisma.flashSale.findFirst({
      where: {
        isActive: true,
        startAt: { lte: now },
        endAt: { gte: now },
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                shortDesc: true,
                basePrice: true,
                stockCount: true,
                images: {
                  where: { isPrimary: true },
                  select: { url: true, altText: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: { startAt: "desc" },
    });

    if (!flashSale) {
      return NextResponse.json({ flashSale: null, endsAt: null });
    }

    return NextResponse.json({
      flashSale,
      endsAt: flashSale.endAt.toISOString(),
    });
  } catch (error) {
    console.error("Active flash sale API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch active flash sale" },
      { status: 500 }
    );
  }
}

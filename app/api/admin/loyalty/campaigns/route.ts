import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const campaigns = await prisma.pointsMultiplierCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Loyalty campaigns GET error:", error);
    return NextResponse.json(
      { error: "Kampanyalar alinamadi" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, multiplier, startAt, endAt, isActive, appliesTo, categoryId, minOrderAmount } = body;

    if (!name || !multiplier || !startAt || !endAt) {
      return NextResponse.json(
        { error: "name, multiplier, startAt ve endAt zorunludur" },
        { status: 400 }
      );
    }

    const campaign = await prisma.pointsMultiplierCampaign.create({
      data: {
        name,
        multiplier,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        isActive: isActive ?? true,
        appliesTo: appliesTo ?? "all",
        categoryId: categoryId ?? null,
        minOrderAmount: minOrderAmount ?? null,
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Loyalty campaigns POST error:", error);
    return NextResponse.json(
      { error: "Kampanya olusturulamadi" },
      { status: 500 }
    );
  }
}

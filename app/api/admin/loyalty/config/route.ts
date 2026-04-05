import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getLoyaltyConfig, invalidateLoyaltyCache } from "@/lib/loyalty";

export async function GET() {
  try {
    const config = await getLoyaltyConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("Loyalty config GET error:", error);
    return NextResponse.json(
      { error: "Yapilandirma alinamadi" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const existing = await prisma.loyaltyConfig.findFirst();
    if (!existing) {
      return NextResponse.json(
        { error: "Yapilandirma bulunamadi" },
        { status: 404 }
      );
    }

    const updated = await prisma.loyaltyConfig.update({
      where: { id: existing.id },
      data: body,
    });

    invalidateLoyaltyCache();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Loyalty config PATCH error:", error);
    return NextResponse.json(
      { error: "Yapilandirma guncellenemedi" },
      { status: 500 }
    );
  }
}

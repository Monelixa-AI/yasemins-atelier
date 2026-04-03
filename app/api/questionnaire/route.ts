import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await prisma.questionnaireResponse.create({
      data: {
        occasion: body.occasion,
        guestCount: body.guestCount,
        date: body.date,
        budget: body.budget,
        dietaryNeeds: body.dietaryNeeds ?? [],
        serviceStyle: body.serviceStyle,
        notes: body.notes,
      },
    });

    // Return suggested products based on occasion
    const suggested = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        occasions: body.occasion ? { some: { occasion: { slug: body.occasion } } } : undefined,
      },
      take: 4,
    });

    return NextResponse.json({ responseId: response.id, suggestedProducts: suggested });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

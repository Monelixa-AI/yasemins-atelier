import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const discounts = await prisma.tierDiscount.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(discounts);
  } catch (error) {
    console.error("Tier discounts GET error:", error);
    return NextResponse.json(
      { error: "Kademe indirimleri alinamadi" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tier, productId, categoryId, discount, isActive } = body;

    if (!tier || discount === undefined) {
      return NextResponse.json(
        { error: "tier ve discount zorunludur" },
        { status: 400 }
      );
    }

    const tierDiscount = await prisma.tierDiscount.create({
      data: {
        tier,
        productId: productId ?? null,
        categoryId: categoryId ?? null,
        discount,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(tierDiscount, { status: 201 });
  } catch (error) {
    console.error("Tier discounts POST error:", error);
    return NextResponse.json(
      { error: "Kademe indirimi olusturulamadi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id zorunludur" }, { status: 400 });
    }

    await prisma.tierDiscount.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Tier discounts DELETE error:", error);
    return NextResponse.json(
      { error: "Kademe indirimi silinemedi" },
      { status: 500 }
    );
  }
}

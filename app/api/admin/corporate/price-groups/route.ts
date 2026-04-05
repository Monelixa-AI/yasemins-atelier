import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const groups = await prisma.corporatePriceGroup.findMany({
      include: { _count: { select: { accounts: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ groups });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, discountType, discountValue, categoryRules } = await request.json();

    if (!name || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: "name, discountType ve discountValue zorunlu" }, { status: 400 });
    }

    const group = await prisma.corporatePriceGroup.create({
      data: {
        name,
        description,
        discountType,
        discountValue,
        categoryRules: categoryRules || [],
      },
    });

    return NextResponse.json(group, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

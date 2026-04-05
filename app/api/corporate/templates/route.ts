import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const corporateId = searchParams.get("corporateId");

    if (!corporateId) {
      return NextResponse.json({ error: "corporateId parametresi zorunlu" }, { status: 400 });
    }

    const templates = await prisma.orderTemplate.findMany({
      where: { corporateId },
      orderBy: { lastUsedAt: { sort: "desc", nulls: "last" } },
    });

    return NextResponse.json({ templates });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { corporateId, name, description, items, deliveryAddress, notes } = await request.json();

    if (!corporateId || !name || !items) {
      return NextResponse.json({ error: "corporateId, name ve items zorunlu" }, { status: 400 });
    }

    const template = await prisma.orderTemplate.create({
      data: {
        corporateId,
        name,
        description,
        items,
        deliveryAddress: deliveryAddress || undefined,
        notes,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

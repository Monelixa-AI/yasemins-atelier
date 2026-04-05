import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { orderId, requestedBy } = await request.json();

    if (!orderId || !requestedBy) {
      return NextResponse.json({ error: "orderId ve requestedBy zorunlu" }, { status: 400 });
    }

    const existing = await prisma.orderApproval.findUnique({ where: { orderId } });
    if (existing) {
      return NextResponse.json({ error: "Bu siparis icin zaten bir onay talebi mevcut" }, { status: 409 });
    }

    const approval = await prisma.orderApproval.create({
      data: {
        orderId,
        requestedBy,
        status: "PENDING",
      },
    });

    return NextResponse.json({ approval }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

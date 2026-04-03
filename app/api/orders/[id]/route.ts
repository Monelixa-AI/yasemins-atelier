import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true, timeline: { orderBy: { createdAt: "desc" } } },
    });
    if (!order) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

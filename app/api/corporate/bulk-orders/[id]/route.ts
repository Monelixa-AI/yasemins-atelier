import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const bulkOrder = await prisma.bulkOrder.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          include: {
            items: true,
          },
          orderBy: { createdAt: "asc" },
        },
        corporate: { select: { id: true, companyName: true } },
      },
    });

    if (!bulkOrder) {
      return NextResponse.json({ error: "Toplu siparis bulunamadi" }, { status: 404 });
    }

    return NextResponse.json(bulkOrder);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

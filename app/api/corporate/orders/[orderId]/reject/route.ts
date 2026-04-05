import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { note } = await request.json();

    if (!note) {
      return NextResponse.json({ error: "Red notu zorunlu" }, { status: 400 });
    }

    const approval = await prisma.orderApproval.update({
      where: { orderId: params.orderId },
      data: {
        status: "REJECTED",
        respondedAt: new Date(),
        note,
      },
    });

    await prisma.order.update({
      where: { id: params.orderId },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(approval);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

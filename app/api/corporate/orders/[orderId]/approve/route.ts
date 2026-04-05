import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request, { params }: { params: { orderId: string } }) {
  try {
    const { approvedBy, note } = await request.json();

    if (!approvedBy) {
      return NextResponse.json({ error: "approvedBy zorunlu" }, { status: 400 });
    }

    const approval = await prisma.orderApproval.update({
      where: { orderId: params.orderId },
      data: {
        status: "APPROVED",
        approvedBy,
        respondedAt: new Date(),
        note: note || null,
      },
    });

    await prisma.order.update({
      where: { id: params.orderId },
      data: { status: "CONFIRMED" },
    });

    return NextResponse.json(approval);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { trackingNo, carrier } = await request.json()

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    const currentMetadata = (order as unknown as { metadata?: Record<string, unknown> }).metadata || {}

    await prisma.order.update({
      where: { id: params.id },
      data: {
        status: "OUT_FOR_DELIVERY",
        // Store tracking info in adminNote for now (no metadata field on Order)
        adminNote: `Kargo: ${carrier || "Yurtiçi Kargo"} — Takip No: ${trackingNo}`,
      },
    })

    await prisma.orderTimeline.create({
      data: {
        orderId: params.id,
        status: "OUT_FOR_DELIVERY",
        note: `Kargo takip: ${carrier || "Yurtiçi Kargo"} — ${trackingNo}`,
        createdBy: "admin",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Kargo takip hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

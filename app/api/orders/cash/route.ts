import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { orderId, method } = await request.json()

    if (!orderId || !method) {
      return NextResponse.json(
        { error: "orderId ve method gerekli" },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    const cashFee = 10
    const provider = method === "POS_ON_DELIVERY" ? "POS_ON_DELIVERY" : "CASH"
    const paymentMethod = method === "POS_ON_DELIVERY" ? "CASH_ON_DELIVERY" : "CASH_ON_DELIVERY"

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentMethod,
        total: { increment: cashFee },
        status: "CONFIRMED",
      },
    })

    await prisma.payment.create({
      data: {
        orderId,
        amount: order.total.toNumber() + cashFee,
        provider,
        status: "PENDING",
        method: method === "POS_ON_DELIVERY" ? "POS_ON_DELIVERY" : "CASH",
      },
    })

    await prisma.orderTimeline.create({
      data: {
        orderId,
        status: "CONFIRMED",
        note: `Kapıda ${method === "POS_ON_DELIVERY" ? "POS" : "nakit"} ödeme seçildi (+${cashFee}₺)`,
        createdBy: "system",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Kapıda ödeme hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

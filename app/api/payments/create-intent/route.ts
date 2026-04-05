import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "orderId gerekli" }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Bu sipariş zaten ödenmiş" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total.toNumber() * 100),
      currency: "try",
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        type: "order",
      },
      automatic_payment_methods: { enabled: true },
    })

    await prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentId: paymentIntent.id },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Stripe PaymentIntent hatası:", error)
    return NextResponse.json({ error: "Ödeme başlatılamadı" }, { status: 500 })
  }
}

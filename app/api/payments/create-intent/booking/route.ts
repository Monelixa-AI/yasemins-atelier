import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId gerekli" }, { status: 400 })
    }

    const booking = await prisma.serviceBooking.findUnique({
      where: { id: bookingId },
    })

    if (!booking) {
      return NextResponse.json({ error: "Rezervasyon bulunamadı" }, { status: 404 })
    }

    if (booking.depositPaid) {
      return NextResponse.json({ error: "Depozit zaten ödenmiş" }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.depositAmount.toNumber() * 100),
      currency: "try",
      metadata: {
        bookingId: booking.id,
        bookingNumber: booking.bookingNumber,
        type: "deposit",
      },
      automatic_payment_methods: { enabled: true },
    })

    await prisma.serviceBooking.update({
      where: { id: bookingId },
      data: { stripePaymentId: paymentIntent.id },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Booking PaymentIntent hatası:", error)
    return NextResponse.json({ error: "Ödeme başlatılamadı" }, { status: 500 })
  }
}

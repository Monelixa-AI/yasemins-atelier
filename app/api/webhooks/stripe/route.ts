import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"
import { sendOrderConfirmation, sendBookingConfirmation } from "@/lib/email"
import { sendSMS, SMS_TEMPLATES } from "@/lib/sms"
import type Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Imza eksik" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook imza hatası:", err)
    return NextResponse.json({ error: "Geçersiz imza" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent
        const { orderId, bookingId, type } = pi.metadata

        if (orderId && type !== "deposit") {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "PAID",
              status: "CONFIRMED",
              paymentMethod: "STRIPE",
            },
          })

          await prisma.payment.create({
            data: {
              orderId,
              amount: pi.amount / 100,
              provider: "STRIPE",
              providerPaymentId: pi.id,
              providerStatus: pi.status,
              status: "PAID",
              method: "CREDIT_CARD",
              last4: pi.payment_method_types?.[0] === "card"
                ? (pi as unknown as { charges?: { data?: Array<{ payment_method_details?: { card?: { last4?: string } } }> } }).charges?.data?.[0]?.payment_method_details?.card?.last4 || null
                : null,
            },
          })

          await prisma.orderTimeline.create({
            data: {
              orderId,
              status: "CONFIRMED",
              note: "Ödeme alındı (Stripe)",
              createdBy: "system",
            },
          })

          // Send notifications
          const fullOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true, address: true, user: true },
          })
          if (fullOrder) {
            sendOrderConfirmation(fullOrder).catch(console.error)
            const phone = fullOrder.address?.phone || fullOrder.user?.phone || fullOrder.guestPhone
            if (phone) {
              sendSMS(phone, SMS_TEMPLATES.orderConfirmed(fullOrder.orderNumber)).catch(console.error)
            }
          }
        }

        if (bookingId && type === "deposit") {
          await prisma.serviceBooking.update({
            where: { id: bookingId },
            data: {
              depositPaid: true,
              status: "DEPOSIT_PAID",
            },
          })

          const booking = await prisma.serviceBooking.findUnique({
            where: { id: bookingId },
          })

          await prisma.payment.create({
            data: {
              bookingId,
              amount: pi.amount / 100,
              provider: "STRIPE",
              providerPaymentId: pi.id,
              providerStatus: pi.status,
              status: "PAID",
              method: "CREDIT_CARD",
            },
          })

          if (booking) {
            await prisma.bookingTimeline.create({
              data: {
                bookingId,
                status: "DEPOSIT_PAID",
                note: "Depozit ödendi (Stripe)",
                createdBy: "system",
              },
            })
          }

          const fullBooking = await prisma.serviceBooking.findUnique({ where: { id: bookingId } })
          if (fullBooking) {
            sendBookingConfirmation(fullBooking).catch(console.error)
          }
        }
        break
      }

      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent
        const { orderId } = pi.metadata

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: "FAILED" },
          })

          await prisma.orderTimeline.create({
            data: {
              orderId,
              status: "PENDING",
              note: "Ödeme başarısız",
              createdBy: "system",
            },
          })
        }
        break
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge
        const piId = typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id

        if (piId) {
          const payment = await prisma.payment.findFirst({
            where: { providerPaymentId: piId },
          })

          if (payment) {
            const isFullRefund = charge.amount_refunded === charge.amount
            if (payment.orderId) {
              await prisma.order.update({
                where: { id: payment.orderId },
                data: {
                  paymentStatus: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED",
                },
              })
            }
          }
        }
        break
      }
    }
  } catch (error) {
    console.error("Webhook işleme hatası:", error)
  }

  return NextResponse.json({ received: true })
}

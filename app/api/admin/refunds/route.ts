import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { iyzico } from "@/lib/iyzico"
import { prisma } from "@/lib/db"
import Iyzipay from "iyzipay"

export async function POST(request: Request) {
  try {
    const { paymentId, amount, reason, adminUserId } = await request.json()

    if (!paymentId || !amount || !adminUserId) {
      return NextResponse.json(
        { error: "paymentId, amount ve adminUserId gerekli" },
        { status: 400 }
      )
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    })

    if (!payment) {
      return NextResponse.json({ error: "Ödeme bulunamadı" }, { status: 404 })
    }

    if (payment.status !== "PAID") {
      return NextResponse.json(
        { error: "Sadece ödenmiş işlemler iade edilebilir" },
        { status: 400 }
      )
    }

    let providerRefundId: string | null = null
    let refundStatus = "pending"

    if (payment.provider === "STRIPE" && payment.providerPaymentId) {
      const refund = await stripe.refunds.create({
        payment_intent: payment.providerPaymentId,
        amount: Math.round(amount * 100),
        reason: "requested_by_customer",
      })
      providerRefundId = refund.id
      refundStatus = refund.status || "succeeded"
    }

    if (payment.provider === "IYZICO" && payment.providerPaymentId) {
      await new Promise<void>((resolve, reject) => {
        iyzico.refund.create(
          {
            locale: Iyzipay.LOCALE.TR,
            paymentTransactionId: payment.providerPaymentId,
            price: amount.toFixed(2),
            currency: Iyzipay.CURRENCY.TRY,
            ip: "85.34.78.112",
          },
          (err, result) => {
            if (err || result.status !== "success") {
              reject(new Error(result?.errorMessage || "iyzico iade hatası"))
              return
            }
            providerRefundId = result.paymentId || null
            refundStatus = "succeeded"
            resolve()
          }
        )
      })
    }

    const refund = await prisma.refund.create({
      data: {
        paymentId,
        amount,
        reason: reason || null,
        providerRefundId,
        status: refundStatus,
        initiatedBy: adminUserId,
      },
    })

    const isFullRefund = amount >= payment.amount.toNumber()

    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED",
          status: isFullRefund ? "REFUNDED" : undefined,
        },
      })

      await prisma.orderTimeline.create({
        data: {
          orderId: payment.orderId,
          status: isFullRefund ? "REFUNDED" : "CONFIRMED",
          note: `${isFullRefund ? "Tam" : "Kısmi"} iade: ${amount}₺ — ${reason || "Sebep belirtilmedi"}`,
          createdBy: adminUserId,
        },
      })
    }

    return NextResponse.json({ refund })
  } catch (error) {
    console.error("İade hatası:", error)
    const message = error instanceof Error ? error.message : "İade işlemi başarısız"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

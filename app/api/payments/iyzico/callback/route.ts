import { NextResponse } from "next/server"
import { iyzico } from "@/lib/iyzico"
import { prisma } from "@/lib/db"
import Iyzipay from "iyzipay"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const token = formData.get("token") as string

    if (!token) {
      return NextResponse.redirect(new URL("/checkout/failed", request.url))
    }

    return new Promise<NextResponse>((resolve) => {
      iyzico.checkoutForm.retrieve(
        { locale: Iyzipay.LOCALE.TR, token },
        async (err, result) => {
          if (err || result.status !== "success") {
            console.error("iyzico callback hatası:", err || result.errorMessage)
            resolve(NextResponse.redirect(new URL("/checkout/failed", request.url)))
            return
          }

          try {
            const order = await prisma.order.findFirst({
              where: { iyzicoPaymentId: token },
            })

            if (!order) {
              resolve(NextResponse.redirect(new URL("/checkout/failed", request.url)))
              return
            }

            await prisma.order.update({
              where: { id: order.id },
              data: {
                paymentStatus: "PAID",
                paymentMethod: "IYZICO",
                status: "CONFIRMED",
              },
            })

            await prisma.payment.create({
              data: {
                orderId: order.id,
                amount: order.total,
                provider: "IYZICO",
                providerPaymentId: result.paymentId || token,
                providerStatus: result.status,
                status: "PAID",
                method: "CREDIT_CARD",
                last4: result.lastFourDigits || null,
                cardBrand: result.cardAssociation || null,
                installments: result.installment || 1,
              },
            })

            await prisma.orderTimeline.create({
              data: {
                orderId: order.id,
                status: "CONFIRMED",
                note: "Ödeme alındı (iyzico)",
                createdBy: "system",
              },
            })

            resolve(
              NextResponse.redirect(
                new URL(`/checkout/success?orderId=${order.id}`, request.url)
              )
            )
          } catch (dbError) {
            console.error("iyzico callback DB hatası:", dbError)
            resolve(NextResponse.redirect(new URL("/checkout/failed", request.url)))
          }
        }
      )
    })
  } catch (error) {
    console.error("iyzico callback hatası:", error)
    return NextResponse.redirect(new URL("/checkout/failed", request.url))
  }
}

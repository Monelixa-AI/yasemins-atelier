import { NextResponse } from "next/server"
import { iyzico } from "@/lib/iyzico"
import { prisma } from "@/lib/db"
import Iyzipay from "iyzipay"

export async function POST(request: Request) {
  try {
    const { orderId, installment } = await request.json()

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

    const callbackUrl = process.env.IYZICO_CALLBACK_URL || `${process.env.NEXTAUTH_URL}/api/payments/iyzico/callback`

    const iyzicoRequest = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: order.orderNumber,
      price: order.total.toFixed(2),
      paidPrice: order.total.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      installment: String(installment || 1),
      basketId: order.id,
      paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl,
      buyer: {
        id: order.userId || order.guestEmail || "guest",
        name: order.guestPhone ? "Misafir" : "Misafir",
        surname: ".",
        email: order.guestEmail || "guest@yaseminsatelier.com",
        identityNumber: "11111111111",
        registrationAddress: "İstanbul",
        city: "İstanbul",
        country: "Turkey",
        ip: "85.34.78.112",
      },
      shippingAddress: {
        contactName: "Misafir",
        city: "İstanbul",
        country: "Turkey",
        address: "İstanbul",
      },
      billingAddress: {
        contactName: "Misafir",
        city: "İstanbul",
        country: "Turkey",
        address: "İstanbul",
      },
      basketItems: order.items.map((item) => ({
        id: item.productId || item.bundleId || item.id,
        name: item.name,
        category1: "Yiyecek",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: item.total.toFixed(2),
      })),
    }

    return new Promise<NextResponse>((resolve) => {
      iyzico.checkoutFormInitialize.create(iyzicoRequest, (err, result) => {
        if (err || result.status !== "success") {
          console.error("iyzico hatası:", err || result.errorMessage)
          resolve(
            NextResponse.json(
              { error: result?.errorMessage || "iyzico başlatılamadı" },
              { status: 500 }
            )
          )
          return
        }

        prisma.order
          .update({
            where: { id: orderId },
            data: { iyzicoPaymentId: result.token },
          })
          .then(() => {
            resolve(
              NextResponse.json({
                checkoutFormContent: result.checkoutFormContent,
                token: result.token,
              })
            )
          })
          .catch(() => {
            resolve(
              NextResponse.json({ error: "DB güncelleme hatası" }, { status: 500 })
            )
          })
      })
    })
  } catch (error) {
    console.error("iyzico initialize hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

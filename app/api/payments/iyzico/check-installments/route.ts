import { NextResponse } from "next/server"
import { iyzico } from "@/lib/iyzico"
import Iyzipay from "iyzipay"

export async function POST(request: Request) {
  try {
    const { binNumber, price } = await request.json()

    if (!binNumber || !price) {
      return NextResponse.json(
        { error: "binNumber ve price gerekli" },
        { status: 400 }
      )
    }

    return new Promise<NextResponse>((resolve) => {
      iyzico.installmentInfo.retrieve(
        {
          locale: Iyzipay.LOCALE.TR,
          binNumber: binNumber.substring(0, 6),
          price: String(price),
        },
        (err, result) => {
          if (err || result.status !== "success") {
            resolve(
              NextResponse.json(
                { error: result?.errorMessage || "Taksit bilgisi alınamadı" },
                { status: 500 }
              )
            )
            return
          }

          resolve(
            NextResponse.json({
              installments: result.installmentDetails || [],
            })
          )
        }
      )
    })
  } catch (error) {
    console.error("Taksit kontrol hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

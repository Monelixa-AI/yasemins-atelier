import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { requestDataDeletion } from "@/lib/legal/data-subject-rights"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, confirmEmail, reason } = body

    if (!userId || !confirmEmail) {
      return NextResponse.json(
        { error: "userId ve confirmEmail gerekli" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json(
        { error: "Kullanici bulunamadi" },
        { status: 404 }
      )
    }

    if (user.email !== confirmEmail) {
      return NextResponse.json(
        { error: "E-posta adresi eslesmedi" },
        { status: 400 }
      )
    }

    await requestDataDeletion(userId, reason)

    return NextResponse.json({
      success: true,
      message:
        "Silme talebiniz alindi. Talebiniz 30 gun icinde islenecektir. Islem tamamlandiginda e-posta ile bilgilendirileceksiniz.",
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bir hata olustu"
    console.error("Deletion request POST hatasi:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

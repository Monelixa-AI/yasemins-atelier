import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token ve yeni sifre gerekli" },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.findUnique({
      where: { key: `reset_${token}` },
    })

    if (!setting) {
      return NextResponse.json(
        { error: "Gecersiz veya suresi dolmus token" },
        { status: 400 }
      )
    }

    const { email, expiresAt } = setting.value as {
      email: string
      expiresAt: string
    }

    if (new Date(expiresAt) < new Date()) {
      await prisma.setting.delete({ where: { key: `reset_${token}` } })
      return NextResponse.json(
        { error: "Token suresi dolmus" },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    })

    await prisma.setting.delete({ where: { key: `reset_${token}` } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset password hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

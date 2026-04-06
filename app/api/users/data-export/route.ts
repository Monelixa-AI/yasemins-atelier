import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { exportUserData } from "@/lib/legal/data-subject-rights"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "userId gerekli" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json(
        { error: "Kullanici bulunamadi" },
        { status: 404 }
      )
    }

    const data = await exportUserData(userId)

    // Create DataAccessRequest record
    await prisma.dataAccessRequest.create({
      data: {
        userId,
        status: "COMPLETED",
        processedAt: new Date(),
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Data export POST hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.note || !body.createdBy) {
      return NextResponse.json(
        { error: "userId, note ve createdBy gerekli" },
        { status: 400 }
      )
    }

    const note = await prisma.cRMNote.create({
      data: {
        userId: body.userId,
        note: body.note,
        createdBy: body.createdBy,
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Admin CRM notes POST hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

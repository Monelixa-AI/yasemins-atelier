import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const segments = await prisma.customerSegment.findMany({
      include: {
        _count: { select: { users: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(segments)
  } catch (error) {
    console.error("Admin CRM segments GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.name || !body.rules) {
      return NextResponse.json(
        { error: "name ve rules gerekli" },
        { status: 400 }
      )
    }

    const segment = await prisma.customerSegment.create({
      data: {
        name: body.name,
        description: body.description,
        rules: body.rules,
      },
    })

    return NextResponse.json(segment, { status: 201 })
  } catch (error) {
    console.error("Admin CRM segments POST hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

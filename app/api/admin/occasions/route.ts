import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const occasions = await prisma.occasion.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { sortOrder: "asc" },
    })

    return NextResponse.json(occasions)
  } catch (error) {
    console.error("Admin occasions GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

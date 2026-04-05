import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const zones = await prisma.deliveryZone.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(zones)
  } catch (error) {
    console.error("Admin delivery-zones GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

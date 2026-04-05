import { NextResponse } from "next/server"
import { services } from "@/lib/data/services"

export async function GET() {
  try {
    return NextResponse.json(services)
  } catch (error) {
    console.error("Admin services GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

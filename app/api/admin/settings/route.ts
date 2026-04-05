import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    if (key) {
      const setting = await prisma.setting.findUnique({
        where: { key },
      })

      if (!setting) {
        return NextResponse.json({ error: "Ayar bulunamadı" }, { status: 404 })
      }

      return NextResponse.json(setting)
    }

    const settings = await prisma.setting.findMany({
      orderBy: { key: "asc" },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Admin settings GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    if (!body.key || body.value === undefined) {
      return NextResponse.json(
        { error: "key ve value gerekli" },
        { status: 400 }
      )
    }

    const setting = await prisma.setting.upsert({
      where: { key: body.key },
      update: {
        value: body.value,
        updatedBy: body.updatedBy || null,
      },
      create: {
        key: body.key,
        value: body.value,
        updatedBy: body.updatedBy || null,
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Admin settings PATCH hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

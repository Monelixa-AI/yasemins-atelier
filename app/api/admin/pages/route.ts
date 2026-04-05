import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error("Admin pages GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const page = await prisma.page.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        isPublished: body.isPublished || false,
        metaTitle: body.metaTitle,
        metaDesc: body.metaDesc,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error("Admin pages POST hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

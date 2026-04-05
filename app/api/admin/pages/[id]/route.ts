import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: params.id },
    })

    if (!page) {
      return NextResponse.json({ error: "Sayfa bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error("Admin pages GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const data: Record<string, unknown> = {}

    if (body.title !== undefined) data.title = body.title
    if (body.slug !== undefined) data.slug = body.slug
    if (body.content !== undefined) data.content = body.content
    if (body.isPublished !== undefined) data.isPublished = body.isPublished
    if (body.metaTitle !== undefined) data.metaTitle = body.metaTitle
    if (body.metaDesc !== undefined) data.metaDesc = body.metaDesc

    const page = await prisma.page.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error("Admin pages PATCH hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.page.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin pages DELETE hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

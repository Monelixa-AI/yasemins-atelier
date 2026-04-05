import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: {
        tags: true,
        occasions: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Yazı bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Admin blog GET hatası:", error)
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
    if (body.excerpt !== undefined) data.excerpt = body.excerpt
    if (body.content !== undefined) data.content = body.content
    if (body.coverImage !== undefined) data.coverImage = body.coverImage
    if (body.status !== undefined) data.status = body.status
    if (body.publishedAt !== undefined) data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null
    if (body.scheduledAt !== undefined) data.scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null
    if (body.readingMins !== undefined) data.readingMins = body.readingMins
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured
    if (body.metaTitle !== undefined) data.metaTitle = body.metaTitle
    if (body.metaDesc !== undefined) data.metaDesc = body.metaDesc
    if (body.ogImage !== undefined) data.ogImage = body.ogImage

    if (body.tagIds !== undefined) {
      data.tags = { set: body.tagIds.map((id: string) => ({ id })) }
    }
    if (body.occasionIds !== undefined) {
      data.occasions = { set: body.occasionIds.map((id: string) => ({ id })) }
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data,
      include: {
        tags: true,
        occasions: true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Admin blog PATCH hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.blogPost.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin blog DELETE hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Prisma.ReviewWhereInput = {}

    if (status) {
      where.status = status as Prisma.EnumReviewStatusFilter
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, slug: true } },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Admin reviews GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: "id gerekli" }, { status: 400 })
    }

    const data: Record<string, unknown> = {}

    if (body.status !== undefined) data.status = body.status
    if (body.adminReply !== undefined) data.adminReply = body.adminReply
    if (body.isPinned !== undefined) data.isPinned = body.isPinned

    const review = await prisma.review.update({
      where: { id: body.id },
      data,
      include: {
        product: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(review)
  } catch (error) {
    console.error("Admin reviews PATCH hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

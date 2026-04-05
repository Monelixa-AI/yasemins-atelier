import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Prisma.BlogPostWhereInput = {}

    if (status) {
      where.status = status as Prisma.EnumBlogStatusFilter
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          tags: true,
          occasions: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Admin blog GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt,
        content: body.content,
        coverImage: body.coverImage,
        status: body.status || "DRAFT",
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        readingMins: body.readingMins || 3,
        isFeatured: body.isFeatured || false,
        metaTitle: body.metaTitle,
        metaDesc: body.metaDesc,
        ogImage: body.ogImage,
        tags: body.tagIds?.length
          ? { connect: body.tagIds.map((id: string) => ({ id })) }
          : undefined,
        occasions: body.occasionIds?.length
          ? { connect: body.occasionIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: {
        tags: true,
        occasions: true,
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Admin blog POST hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

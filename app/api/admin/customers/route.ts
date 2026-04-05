import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const segment = searchParams.get("segment")
    const minOrders = searchParams.get("minOrders")
    const maxOrders = searchParams.get("maxOrders")
    const minSpent = searchParams.get("minSpent")
    const maxSpent = searchParams.get("maxSpent")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ]
    }

    if (segment) {
      where.segments = { some: { id: segment } }
    }

    if (minOrders) {
      where.orderCount = { ...((where.orderCount as Prisma.IntFilter) || {}), gte: parseInt(minOrders) }
    }
    if (maxOrders) {
      where.orderCount = { ...((where.orderCount as Prisma.IntFilter) || {}), lte: parseInt(maxOrders) }
    }

    if (minSpent) {
      where.totalSpent = { ...((where.totalSpent as Prisma.DecimalFilter) || {}), gte: parseFloat(minSpent) }
    }
    if (maxSpent) {
      where.totalSpent = { ...((where.totalSpent as Prisma.DecimalFilter) || {}), lte: parseFloat(maxSpent) }
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          loyaltyTier: true,
          loyaltyPoints: true,
          totalSpent: true,
          orderCount: true,
          isActive: true,
          isCorporate: true,
          companyName: true,
          createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      customers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Admin customers GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

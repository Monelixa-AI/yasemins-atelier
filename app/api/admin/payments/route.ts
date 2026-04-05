import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get("provider")
    const status = searchParams.get("status")
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Prisma.PaymentWhereInput = {}

    if (provider) {
      where.provider = provider as Prisma.EnumPaymentProviderFilter
    }
    if (status) {
      where.status = status as Prisma.EnumPaymentStatusFilter
    }
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(to)
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          order: { select: { orderNumber: true, guestEmail: true } },
          booking: { select: { bookingNumber: true, guestEmail: true } },
          refunds: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ])

    // Özet istatistikler
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [todayRevenue, pendingCount, monthRefunds, failedCount] =
      await Promise.all([
        prisma.payment.aggregate({
          where: { status: "PAID", createdAt: { gte: today } },
          _sum: { amount: true },
        }),
        prisma.payment.count({ where: { status: "PENDING" } }),
        prisma.refund.aggregate({
          where: {
            createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) },
            status: "succeeded",
          },
          _sum: { amount: true },
        }),
        prisma.payment.count({ where: { status: "FAILED" } }),
      ])

    return NextResponse.json({
      payments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats: {
        todayRevenue: todayRevenue._sum.amount?.toNumber() || 0,
        pendingCount,
        monthRefunds: monthRefunds._sum.amount?.toNumber() || 0,
        failedCount,
      },
    })
  } catch (error) {
    console.error("Admin payments hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

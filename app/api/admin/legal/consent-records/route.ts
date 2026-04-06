import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const consentType = searchParams.get("consentType")
    const granted = searchParams.get("granted")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Prisma.ConsentRecordWhereInput = {}

    if (consentType) {
      where.consentType = consentType as Prisma.EnumConsentTypeFilter
    }
    if (granted !== null && granted !== undefined && granted !== "") {
      where.granted = granted === "true"
    }
    if (dateFrom) {
      where.createdAt = {
        ...((where.createdAt as Prisma.DateTimeFilter) || {}),
        gte: new Date(dateFrom),
      }
    }
    if (dateTo) {
      where.createdAt = {
        ...((where.createdAt as Prisma.DateTimeFilter) || {}),
        lte: new Date(dateTo),
      }
    }

    const [records, total] = await Promise.all([
      prisma.consentRecord.findMany({
        where,
        include: {
          user: { select: { id: true, email: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.consentRecord.count({ where }),
    ])

    // Stats
    const [totalUsers, emailMarketing, smsMarketing, analyticsCookies] =
      await Promise.all([
        prisma.user.count(),
        prisma.consentRecord.count({
          where: { consentType: "EMAIL_MARKETING", granted: true },
        }),
        prisma.consentRecord.count({
          where: { consentType: "SMS_MARKETING", granted: true },
        }),
        prisma.consentRecord.count({
          where: { consentType: "ANALYTICS_COOKIES", granted: true },
        }),
      ])

    const safeDiv = (a: number, b: number) =>
      b === 0 ? 0 : Math.round((a / b) * 100)

    const stats = {
      emailMarketingRate: safeDiv(emailMarketing, totalUsers),
      smsMarketingRate: safeDiv(smsMarketing, totalUsers),
      analyticsCookieRate: safeDiv(analyticsCookies, totalUsers),
    }

    return NextResponse.json({
      records,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      stats,
    })
  } catch (error) {
    console.error("Admin consent-records GET hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

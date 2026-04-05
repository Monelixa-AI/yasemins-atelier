import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const search = searchParams.get("search");
    const paymentStatus = searchParams.get("paymentStatus");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
    const sort = searchParams.get("sort") || "createdAt_desc";

    const where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = status as Prisma.EnumOrderStatusFilter;
    }
    if (paymentStatus) {
      where.paymentStatus = paymentStatus as Prisma.EnumPaymentStatusFilter;
    }
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { guestEmail: { contains: search, mode: "insensitive" } },
        { guestPhone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [sortField, sortDir] = sort.split("_");
    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      [sortField]: sortDir === "asc" ? "asc" : "desc",
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          items: true,
          timeline: { orderBy: { createdAt: "desc" } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Orders list API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

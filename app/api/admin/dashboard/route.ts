import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = parseInt(searchParams.get("range") || "30", 10);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const rangeStart = new Date(todayStart);
    rangeStart.setDate(rangeStart.getDate() - range);

    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    // --- Core metrics ---
    const [
      todayOrders,
      todayRevenueAgg,
      pendingOrders,
      pendingBookings,
      weekRevenueAgg,
      yesterdayOrders,
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.order.count({
        where: { status: "PENDING" },
      }),
      prisma.serviceBooking.count({
        where: { status: "PENDING" },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: weekStart } },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: yesterdayStart, lt: todayStart },
        },
      }),
    ]);

    const todayRevenue = todayRevenueAgg._sum.total?.toNumber() ?? 0;
    const weekRevenue = weekRevenueAgg._sum.total?.toNumber() ?? 0;

    // --- Chart data: orders grouped by date for last N days ---
    const chartOrders = await prisma.order.findMany({
      where: { createdAt: { gte: rangeStart } },
      select: { createdAt: true, total: true },
    });

    const chartMap = new Map<string, { orders: number; revenue: number }>();
    for (let i = 0; i < range; i++) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      chartMap.set(key, { orders: 0, revenue: 0 });
    }
    for (const o of chartOrders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      const entry = chartMap.get(key);
      if (entry) {
        entry.orders += 1;
        entry.revenue += o.total?.toNumber() ?? 0;
      }
    }
    const chartData = Array.from(chartMap.entries())
      .map(([date, data]) => ({ date, orders: data.orders, revenue: data.revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // --- Category data: orders per occasion ---
    const occasionProducts = await prisma.occasionProduct.findMany({
      select: { occasionId: true, productId: true },
    });
    const productToOccasions = new Map<string, string[]>();
    for (const op of occasionProducts) {
      const list = productToOccasions.get(op.productId) || [];
      list.push(op.occasionId);
      productToOccasions.set(op.productId, list);
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { productId: { not: null } },
      select: { productId: true },
    });

    const occasionCountMap = new Map<string, number>();
    for (const item of orderItems) {
      if (!item.productId) continue;
      const occasions = productToOccasions.get(item.productId) || [];
      for (const occId of occasions) {
        occasionCountMap.set(occId, (occasionCountMap.get(occId) || 0) + 1);
      }
    }

    const allOccasions = await prisma.occasion.findMany({
      select: { id: true, name: true },
    });
    const categoryData = allOccasions.map((occ) => ({
      name: occ.name,
      orders: occasionCountMap.get(occ.id) || 0,
    }));

    // --- Recent pending orders ---
    const recentPending = await prisma.order.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        orderNumber: true,
        guestEmail: true,
        total: true,
        createdAt: true,
      },
    });

    // --- Low stock products ---
    const lowStock = await prisma.product.findMany({
      where: {
        stockCount: { not: null },
        lowStockAlert: { not: null },
      },
      select: {
        id: true,
        name: true,
        stockCount: true,
        lowStockAlert: true,
      },
    });
    const lowStockFiltered = lowStock.filter(
      (p) => p.stockCount !== null && p.lowStockAlert !== null && p.stockCount <= p.lowStockAlert
    );

    // --- Pending reviews ---
    const pendingReviews = await prisma.review.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        rating: true,
        body: true,
        product: { select: { name: true } },
        user: { select: { name: true } },
      },
    });

    const pendingReviewsMapped = pendingReviews.map((r) => ({
      id: r.id,
      productName: r.product.name,
      rating: r.rating,
      body: r.body,
      userName: r.user.name,
    }));

    return NextResponse.json({
      todayOrders,
      todayRevenue,
      pendingOrders,
      pendingBookings,
      weekRevenue,
      yesterdayOrders,
      chartData,
      categoryData,
      recentPending,
      lowStock: lowStockFiltered,
      pendingReviews: pendingReviewsMapped,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

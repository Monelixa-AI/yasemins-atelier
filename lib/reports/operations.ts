import { prisma } from "@/lib/db";
import { differenceInMinutes } from "date-fns";
import type { ReportFilter, Report, MetricCard, ChartData, TableRow } from "./types";
import {
  getPreviousPeriod,
  calcChangePercent,
  getTrend,
} from "./helpers";

// ─────────────────────────────────────────────────────────
// 1. Delivery Report
// ─────────────────────────────────────────────────────────

export async function getDeliveryReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;
  const prevRange = filter.compareWith ?? getPreviousPeriod(dateRange);

  // Orders with delivery info in date range
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
      paymentStatus: "PAID",
      status: { not: "CANCELLED" },
    },
    select: {
      id: true,
      status: true,
      zoneId: true,
      zone: { select: { name: true } },
      timeline: {
        select: { status: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const prevDelivered = await prisma.order.count({
    where: {
      createdAt: { gte: prevRange.from, lte: prevRange.to },
      status: "DELIVERED",
    },
  });

  // Zone distribution
  const zoneMap = new Map<string, number>();
  let deliveredCount = 0;
  let failedCount = 0;
  const prepTimes: number[] = [];

  for (const o of orders) {
    const zoneName = o.zone?.name ?? "Belirtilmemis";
    zoneMap.set(zoneName, (zoneMap.get(zoneName) ?? 0) + 1);

    if (o.status === "DELIVERED") deliveredCount++;
    // Count only explicit delivery failures (no DELIVERED status)
    // We don't have a FAILED delivery status on Order, so we skip failed count from Order model

    // Average prep time: from CONFIRMED to READY in timeline
    const confirmed = o.timeline.find((t) => t.status === "CONFIRMED");
    const ready = o.timeline.find((t) => t.status === "READY");
    if (confirmed && ready) {
      prepTimes.push(differenceInMinutes(ready.createdAt, confirmed.createdAt));
    }
  }

  const totalOrders = orders.length;
  const deliverySuccessRate =
    totalOrders > 0
      ? Math.round((deliveredCount / totalOrders) * 10000) / 100
      : 0;
  const avgPrepTime =
    prepTimes.length > 0
      ? Math.round(prepTimes.reduce((s, t) => s + t, 0) / prepTimes.length)
      : 0;

  const metrics: MetricCard[] = [
    {
      label: "Teslim Edilen",
      value: deliveredCount,
      previousValue: prevDelivered,
      changePercent: calcChangePercent(deliveredCount, prevDelivered),
      trend: getTrend(deliveredCount, prevDelivered),
      format: "number",
    },
    { label: "Teslimat Basari Orani", value: deliverySuccessRate, format: "percent" },
    { label: "Ort. Hazirlama (dk)", value: avgPrepTime, format: "number" },
    { label: "Toplam Siparis", value: totalOrders, format: "number" },
  ];

  // Zone chart
  const zoneEntries = Array.from(zoneMap.entries()).sort((a, b) => b[1] - a[1]);
  const zoneChart: ChartData = {
    labels: zoneEntries.map(([name]) => name),
    datasets: [{ label: "Siparis", data: zoneEntries.map(([, c]) => c) }],
  };

  const table: TableRow[] = zoneEntries.map(([zone, count]) => ({
    zone,
    count,
    share:
      totalOrders > 0
        ? Math.round((count / totalOrders) * 10000) / 100
        : 0,
  }));

  return {
    title: "Teslimat Raporu",
    generatedAt: new Date(),
    filters: filter,
    metrics,
    charts: [zoneChart],
    table,
  };
}

// ─────────────────────────────────────────────────────────
// 2. Booking Report
// ─────────────────────────────────────────────────────────

export async function getBookingReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;
  const prevRange = filter.compareWith ?? getPreviousPeriod(dateRange);

  const bookings = await prisma.serviceBooking.findMany({
    where: {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
    },
    select: {
      id: true,
      serviceSlug: true,
      packageName: true,
      packagePrice: true,
      status: true,
    },
  });

  const prevBookingCount = await prisma.serviceBooking.count({
    where: {
      createdAt: { gte: prevRange.from, lte: prevRange.to },
    },
  });

  // Service breakdown
  const serviceMap = new Map<
    string,
    { count: number; revenue: number; completed: number }
  >();

  for (const b of bookings) {
    const key = b.serviceSlug;
    const entry = serviceMap.get(key) ?? { count: 0, revenue: 0, completed: 0 };
    entry.count += 1;
    entry.revenue += Number(b.packagePrice);
    if (b.status === "COMPLETED") entry.completed += 1;
    serviceMap.set(key, entry);
  }

  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((s, b) => s + Number(b.packagePrice), 0);
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  const completionRate =
    totalBookings > 0
      ? Math.round((completedCount / totalBookings) * 10000) / 100
      : 0;

  const metrics: MetricCard[] = [
    {
      label: "Toplam Rezervasyon",
      value: totalBookings,
      previousValue: prevBookingCount,
      changePercent: calcChangePercent(totalBookings, prevBookingCount),
      trend: getTrend(totalBookings, prevBookingCount),
      format: "number",
    },
    { label: "Rezervasyon Geliri", value: Math.round(totalRevenue * 100) / 100, format: "currency" },
    { label: "Tamamlanma Orani", value: completionRate, format: "percent" },
  ];

  const serviceEntries = Array.from(serviceMap.entries()).sort(
    (a, b) => b[1].revenue - a[1].revenue
  );
  const serviceChart: ChartData = {
    labels: serviceEntries.map(([slug]) => slug),
    datasets: [
      { label: "Gelir", data: serviceEntries.map(([, d]) => Math.round(d.revenue * 100) / 100) },
      { label: "Adet", data: serviceEntries.map(([, d]) => d.count) },
    ],
  };

  const table: TableRow[] = serviceEntries.map(([slug, data]) => ({
    service: slug,
    count: data.count,
    revenue: Math.round(data.revenue * 100) / 100,
    completed: data.completed,
    completionRate:
      data.count > 0
        ? Math.round((data.completed / data.count) * 10000) / 100
        : 0,
  }));

  return {
    title: "Rezervasyon Raporu",
    generatedAt: new Date(),
    filters: filter,
    metrics,
    charts: [serviceChart],
    table,
  };
}

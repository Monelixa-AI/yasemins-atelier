import { prisma } from "@/lib/db";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from "date-fns";
import { tr } from "date-fns/locale";
import type { ReportFilter, Report, MetricCard, ChartData, TableRow } from "./types";
import {
  getPreviousPeriod,
  calcChangePercent,
  getTrend,
  formatGroupDate,
} from "./helpers";

export async function getSalesReport(filter: ReportFilter): Promise<Report> {
  const { dateRange, groupBy = "day" } = filter;
  const prevRange = filter.compareWith ?? getPreviousPeriod(dateRange);

  // ── Current period orders ────────────────────────────
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
      paymentStatus: "PAID",
    },
    select: {
      id: true,
      total: true,
      status: true,
      paymentMethod: true,
      createdAt: true,
    },
  });

  // ── Previous period orders ───────────────────────────
  const prevOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: prevRange.from, lte: prevRange.to },
      paymentStatus: "PAID",
    },
    select: { total: true, status: true },
  });

  // ── Cancelled orders in range (regardless of payment) ─
  const cancelledCount = await prisma.order.count({
    where: {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
      status: "CANCELLED",
    },
  });
  const totalOrdersInRange = await prisma.order.count({
    where: {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
    },
  });

  // ── Calculate metrics ────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const cancelRate =
    totalOrdersInRange > 0
      ? Math.round((cancelledCount / totalOrdersInRange) * 10000) / 100
      : 0;

  const prevRevenue = prevOrders.reduce((s, o) => s + Number(o.total), 0);
  const prevTotal = prevOrders.length;
  const prevAvg = prevTotal > 0 ? prevRevenue / prevTotal : 0;

  const metrics: MetricCard[] = [
    {
      label: "Toplam Gelir",
      value: totalRevenue,
      previousValue: prevRevenue,
      changePercent: calcChangePercent(totalRevenue, prevRevenue),
      trend: getTrend(totalRevenue, prevRevenue),
      format: "currency",
    },
    {
      label: "Siparis Sayisi",
      value: totalOrders,
      previousValue: prevTotal,
      changePercent: calcChangePercent(totalOrders, prevTotal),
      trend: getTrend(totalOrders, prevTotal),
      format: "number",
    },
    {
      label: "Ortalama Siparis",
      value: Math.round(avgOrderValue * 100) / 100,
      previousValue: Math.round(prevAvg * 100) / 100,
      changePercent: calcChangePercent(avgOrderValue, prevAvg),
      trend: getTrend(avgOrderValue, prevAvg),
      format: "currency",
    },
    {
      label: "Iptal Orani",
      value: cancelRate,
      format: "percent",
    },
  ];

  // ── Grouped chart data ───────────────────────────────
  const groupKey = (d: Date): string => {
    switch (groupBy) {
      case "day":
        return format(startOfDay(d), "yyyy-MM-dd");
      case "week":
        return format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-MM-dd");
      case "month":
        return format(startOfMonth(d), "yyyy-MM");
    }
  };

  const buckets = new Map<string, { revenue: number; count: number }>();

  // Pre-fill all buckets so empty periods show as 0
  const intervals =
    groupBy === "day"
      ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
      : groupBy === "week"
        ? eachWeekOfInterval({ start: dateRange.from, end: dateRange.to }, { weekStartsOn: 1 })
        : eachMonthOfInterval({ start: dateRange.from, end: dateRange.to });

  for (const d of intervals) {
    buckets.set(groupKey(d), { revenue: 0, count: 0 });
  }

  for (const o of orders) {
    const key = groupKey(o.createdAt);
    const b = buckets.get(key) ?? { revenue: 0, count: 0 };
    b.revenue += Number(o.total);
    b.count += 1;
    buckets.set(key, b);
  }

  const sortedKeys = Array.from(buckets.keys()).sort();
  const revenueChart: ChartData = {
    labels: sortedKeys.map((k) => formatGroupDate(new Date(k), groupBy)),
    datasets: [
      { label: "Gelir", data: sortedKeys.map((k) => Math.round((buckets.get(k)?.revenue ?? 0) * 100) / 100) },
      { label: "Siparis", data: sortedKeys.map((k) => buckets.get(k)?.count ?? 0) },
    ],
  };

  // ── Payment method breakdown ─────────────────────────
  const methodMap = new Map<string, { count: number; revenue: number }>();
  for (const o of orders) {
    const m = o.paymentMethod ?? "UNKNOWN";
    const entry = methodMap.get(m) ?? { count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue += Number(o.total);
    methodMap.set(m, entry);
  }

  const table: TableRow[] = Array.from(methodMap.entries()).map(([method, data]) => ({
    method,
    count: data.count,
    revenue: Math.round(data.revenue * 100) / 100,
    share: totalOrders > 0 ? Math.round((data.count / totalOrders) * 10000) / 100 : 0,
  }));

  return {
    title: "Satis Raporu",
    generatedAt: new Date(),
    filters: filter,
    metrics,
    charts: [revenueChart],
    table,
  };
}

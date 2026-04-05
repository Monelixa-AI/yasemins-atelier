import { prisma } from "@/lib/db";
import type { ReportFilter, Report, MetricCard, ChartData, TableRow } from "./types";
import {
  getPreviousPeriod,
  calcChangePercent,
  getTrend,
} from "./helpers";

export async function getProductReport(filter: ReportFilter): Promise<Report> {
  const { dateRange, categoryId } = filter;
  const prevRange = filter.compareWith ?? getPreviousPeriod(dateRange);

  // ── Order items in paid, non-cancelled orders ────────
  const itemWhere = {
    order: {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
      paymentStatus: "PAID" as const,
      status: { not: "CANCELLED" as const },
    },
    ...(categoryId ? { product: { categoryId } } : {}),
  };

  const items = await prisma.orderItem.findMany({
    where: itemWhere,
    include: {
      product: {
        select: {
          id: true,
          name: true,
          costPrice: true,
          categoryId: true,
          category: { select: { id: true, name: true } },
        },
      },
    },
  });

  // ── Previous period for comparison ───────────────────
  const prevItems = await prisma.orderItem.findMany({
    where: {
      order: {
        createdAt: { gte: prevRange.from, lte: prevRange.to },
        paymentStatus: "PAID",
        status: { not: "CANCELLED" as const },
      },
      ...(categoryId ? { product: { categoryId } } : {}),
    },
    select: { quantity: true, total: true },
  });

  // ── Per-product aggregation ──────────────────────────
  const productMap = new Map<
    string,
    { name: string; category: string; quantity: number; revenue: number; cost: number }
  >();

  for (const item of items) {
    const pid = item.productId ?? item.bundleId ?? "unknown";
    const entry = productMap.get(pid) ?? {
      name: item.product?.name ?? item.name,
      category: item.product?.category?.name ?? "-",
      quantity: 0,
      revenue: 0,
      cost: 0,
    };
    entry.quantity += item.quantity;
    entry.revenue += Number(item.total);
    entry.cost += Number(item.product?.costPrice ?? 0) * item.quantity;
    productMap.set(pid, entry);
  }

  // ── Category breakdown ───────────────────────────────
  const catMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  for (const entry of Array.from(productMap.values())) {
    const cat = catMap.get(entry.category) ?? { name: entry.category, quantity: 0, revenue: 0 };
    cat.quantity += entry.quantity;
    cat.revenue += entry.revenue;
    catMap.set(entry.category, cat);
  }

  // ── Metrics ──────────────────────────────────────────
  const totalQuantity = items.reduce((s, i) => s + i.quantity, 0);
  const totalRevenue = items.reduce((s, i) => s + Number(i.total), 0);
  const totalCost = Array.from(productMap.values()).reduce((s, p) => s + p.cost, 0);
  const uniqueProducts = productMap.size;

  const prevQuantity = prevItems.reduce((s, i) => s + i.quantity, 0);
  const prevRevenue = prevItems.reduce((s, i) => s + Number(i.total), 0);

  const metrics: MetricCard[] = [
    {
      label: "Toplam Satis Adedi",
      value: totalQuantity,
      previousValue: prevQuantity,
      changePercent: calcChangePercent(totalQuantity, prevQuantity),
      trend: getTrend(totalQuantity, prevQuantity),
      format: "number",
    },
    {
      label: "Urun Geliri",
      value: Math.round(totalRevenue * 100) / 100,
      previousValue: Math.round(prevRevenue * 100) / 100,
      changePercent: calcChangePercent(totalRevenue, prevRevenue),
      trend: getTrend(totalRevenue, prevRevenue),
      format: "currency",
    },
    {
      label: "Toplam Maliyet",
      value: Math.round(totalCost * 100) / 100,
      format: "currency",
    },
    {
      label: "Brut Kar Marji",
      value: totalRevenue > 0 ? Math.round(((totalRevenue - totalCost) / totalRevenue) * 10000) / 100 : 0,
      format: "percent",
    },
    {
      label: "Benzersiz Urun",
      value: uniqueProducts,
      format: "number",
    },
  ];

  // ── Category chart ───────────────────────────────────
  const catEntries = Array.from(catMap.values()).sort((a, b) => b.revenue - a.revenue);
  const categoryChart: ChartData = {
    labels: catEntries.map((c) => c.name),
    datasets: [
      { label: "Gelir", data: catEntries.map((c) => Math.round(c.revenue * 100) / 100) },
      { label: "Adet", data: catEntries.map((c) => c.quantity) },
    ],
  };

  // ── Top 50 products table ────────────────────────────
  const sorted = Array.from(productMap.entries())
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 50);

  const table: TableRow[] = sorted.map(([id, p]) => ({
    productId: id,
    name: p.name,
    category: p.category,
    quantity: p.quantity,
    revenue: Math.round(p.revenue * 100) / 100,
    cost: Math.round(p.cost * 100) / 100,
    margin:
      p.revenue > 0
        ? Math.round(((p.revenue - p.cost) / p.revenue) * 10000) / 100
        : 0,
  }));

  return {
    title: "Urun Raporu",
    generatedAt: new Date(),
    filters: filter,
    metrics,
    charts: [categoryChart],
    table,
  };
}

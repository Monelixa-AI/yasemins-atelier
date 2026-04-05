import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";
import type { ReportFilter, Report, MetricCard, ChartData, TableRow } from "@/lib/reports/types";
import {
  getPreviousPeriod,
  calcChangePercent,
  getTrend,
  formatGroupDate,
} from "@/lib/reports/helpers";
import { getSalesReport } from "@/lib/reports/sales";

// ─── Helpers ────────────────────────────────────────────

function buildFilter(sp: URLSearchParams): ReportFilter {
  const from = sp.get("from")
    ? startOfDay(new Date(sp.get("from")!))
    : startOfDay(new Date());
  const to = sp.get("to")
    ? endOfDay(new Date(sp.get("to")!))
    : endOfDay(new Date());
  const groupBy = (sp.get("groupBy") as "day" | "week" | "month") || "day";
  const compare = sp.get("compare") === "true";
  const dateRange = { from, to };
  return {
    dateRange,
    compareWith: compare ? getPreviousPeriod(dateRange) : undefined,
    groupBy,
  };
}

// ─── Products report ────────────────────────────────────

async function getProductsReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;
  const prevRange = filter.compareWith ?? getPreviousPeriod(dateRange);

  const items = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: dateRange.from, lte: dateRange.to }, paymentStatus: "PAID" } },
    select: { name: true, quantity: true, total: true, productId: true },
  });

  const prevItems = await prisma.orderItem.findMany({
    where: { order: { createdAt: { gte: prevRange.from, lte: prevRange.to }, paymentStatus: "PAID" } },
    select: { quantity: true, total: true },
  });

  const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const it of items) {
    const key = it.productId ?? it.name;
    const e = productMap.get(key) ?? { name: it.name, qty: 0, revenue: 0 };
    e.qty += it.quantity;
    e.revenue += Number(it.total);
    productMap.set(key, e);
  }

  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const totalRev = items.reduce((s, i) => s + Number(i.total), 0);
  const prevQty = prevItems.reduce((s, i) => s + i.quantity, 0);
  const prevRev = prevItems.reduce((s, i) => s + Number(i.total), 0);
  const uniqueProducts = productMap.size;

  const sorted = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue);

  const metrics: MetricCard[] = [
    { label: "Satilan Adet", value: totalQty, previousValue: prevQty, changePercent: calcChangePercent(totalQty, prevQty), trend: getTrend(totalQty, prevQty), format: "number" },
    { label: "Urun Geliri", value: Math.round(totalRev * 100) / 100, previousValue: Math.round(prevRev * 100) / 100, changePercent: calcChangePercent(totalRev, prevRev), trend: getTrend(totalRev, prevRev), format: "currency" },
    { label: "Benzersiz Urun", value: uniqueProducts, format: "number" },
    { label: "Ort. Birim Fiyat", value: totalQty > 0 ? Math.round((totalRev / totalQty) * 100) / 100 : 0, format: "currency" },
  ];

  const chart: ChartData = {
    labels: sorted.slice(0, 10).map((p) => p.name),
    datasets: [{ label: "Gelir", data: sorted.slice(0, 10).map((p) => Math.round(p.revenue * 100) / 100) }],
  };

  const table: TableRow[] = sorted.map((p) => ({
    name: p.name,
    quantity: p.qty,
    revenue: Math.round(p.revenue * 100) / 100,
    share: totalRev > 0 ? Math.round((p.revenue / totalRev) * 10000) / 100 : 0,
  }));

  return { title: "Urun Raporu", generatedAt: new Date(), filters: filter, metrics, charts: [chart], table };
}

// ─── Customers report ───────────────────────────────────

async function getCustomersReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;
  const prevRange = filter.compareWith ?? getPreviousPeriod(dateRange);

  const [newUsers, prevNewUsers, totalUsers] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: dateRange.from, lte: dateRange.to } } }),
    prisma.user.count({ where: { createdAt: { gte: prevRange.from, lte: prevRange.to } } }),
    prisma.user.count(),
  ]);

  const ordersWithUser = await prisma.order.findMany({
    where: { createdAt: { gte: dateRange.from, lte: dateRange.to }, paymentStatus: "PAID", userId: { not: null } },
    select: { userId: true, total: true },
  });

  const buyerSet = new Set(ordersWithUser.map((o) => o.userId));
  const totalSpent = ordersWithUser.reduce((s, o) => s + Number(o.total), 0);
  const avgSpent = buyerSet.size > 0 ? totalSpent / buyerSet.size : 0;

  const metrics: MetricCard[] = [
    { label: "Yeni Musteri", value: newUsers, previousValue: prevNewUsers, changePercent: calcChangePercent(newUsers, prevNewUsers), trend: getTrend(newUsers, prevNewUsers), format: "number" },
    { label: "Toplam Musteri", value: totalUsers, format: "number" },
    { label: "Aktif Alici", value: buyerSet.size, format: "number" },
    { label: "Ort. Harcama", value: Math.round(avgSpent * 100) / 100, format: "currency" },
  ];

  // Tier distribution
  const tiers = await prisma.user.groupBy({ by: ["loyaltyTier"], _count: true });
  const chart: ChartData = {
    labels: tiers.map((t) => t.loyaltyTier),
    datasets: [{ label: "Musteri", data: tiers.map((t) => t._count) }],
  };

  return { title: "Musteri Raporu", generatedAt: new Date(), filters: filter, metrics, charts: [chart], table: [] };
}

// ─── Marketing report ───────────────────────────────────

async function getMarketingReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;

  const [codes, subscribers] = await Promise.all([
    prisma.discountCode.findMany({
      where: { createdAt: { gte: dateRange.from, lte: dateRange.to } },
      select: { code: true, usedCount: true, type: true, value: true },
    }),
    prisma.newsletterSubscriber.count({ where: { createdAt: { gte: dateRange.from, lte: dateRange.to } } }),
  ]);

  const totalUsed = codes.reduce((s, c) => s + c.usedCount, 0);

  const metrics: MetricCard[] = [
    { label: "Kupon Kullanimi", value: totalUsed, format: "number" },
    { label: "Aktif Kupon", value: codes.length, format: "number" },
    { label: "Yeni Abone", value: subscribers, format: "number" },
    { label: "Ort. Kullanim/Kupon", value: codes.length > 0 ? Math.round((totalUsed / codes.length) * 100) / 100 : 0, format: "number" },
  ];

  const table: TableRow[] = codes.map((c) => ({
    code: c.code,
    type: c.type,
    value: Number(c.value),
    usedCount: c.usedCount,
  }));

  return { title: "Pazarlama Raporu", generatedAt: new Date(), filters: filter, metrics, charts: [], table };
}

// ─── Delivery report ────────────────────────────────────

async function getDeliveryReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: dateRange.from, lte: dateRange.to }, paymentStatus: "PAID" },
    select: { deliveryFee: true, status: true, zone: { select: { name: true } } },
  });

  const totalDeliveryFee = orders.reduce((s, o) => s + Number(o.deliveryFee), 0);
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;
  const deliveryRate = orders.length > 0 ? Math.round((deliveredCount / orders.length) * 10000) / 100 : 0;

  const zoneMap = new Map<string, number>();
  for (const o of orders) {
    const z = o.zone?.name ?? "Belirsiz";
    zoneMap.set(z, (zoneMap.get(z) ?? 0) + 1);
  }

  const metrics: MetricCard[] = [
    { label: "Toplam Teslimat Ucreti", value: Math.round(totalDeliveryFee * 100) / 100, format: "currency" },
    { label: "Teslim Edilen", value: deliveredCount, format: "number" },
    { label: "Teslimat Orani", value: deliveryRate, format: "percent" },
    { label: "Toplam Siparis", value: orders.length, format: "number" },
  ];

  const chart: ChartData = {
    labels: Array.from(zoneMap.keys()),
    datasets: [{ label: "Siparis", data: Array.from(zoneMap.values()) }],
  };

  return { title: "Teslimat Raporu", generatedAt: new Date(), filters: filter, metrics, charts: [chart], table: [] };
}

// ─── Financial report ───────────────────────────────────

async function getFinancialReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;
  const prevRange = filter.compareWith ?? getPreviousPeriod(dateRange);

  const [payments, prevPayments, refunds] = await Promise.all([
    prisma.payment.findMany({
      where: { createdAt: { gte: dateRange.from, lte: dateRange.to }, status: "PAID" },
      select: { amount: true, provider: true, method: true },
    }),
    prisma.payment.findMany({
      where: { createdAt: { gte: prevRange.from, lte: prevRange.to }, status: "PAID" },
      select: { amount: true },
    }),
    prisma.refund.aggregate({
      where: { createdAt: { gte: dateRange.from, lte: dateRange.to } },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const totalIncome = payments.reduce((s, p) => s + Number(p.amount), 0);
  const prevIncome = prevPayments.reduce((s, p) => s + Number(p.amount), 0);
  const refundTotal = Number(refunds._sum.amount ?? 0);
  const netIncome = totalIncome - refundTotal;

  const metrics: MetricCard[] = [
    { label: "Brut Gelir", value: Math.round(totalIncome * 100) / 100, previousValue: Math.round(prevIncome * 100) / 100, changePercent: calcChangePercent(totalIncome, prevIncome), trend: getTrend(totalIncome, prevIncome), format: "currency" },
    { label: "Iadeler", value: Math.round(refundTotal * 100) / 100, format: "currency" },
    { label: "Net Gelir", value: Math.round(netIncome * 100) / 100, format: "currency" },
    { label: "Iade Sayisi", value: refunds._count, format: "number" },
  ];

  const providerMap = new Map<string, number>();
  for (const p of payments) {
    providerMap.set(p.provider, (providerMap.get(p.provider) ?? 0) + Number(p.amount));
  }

  const chart: ChartData = {
    labels: Array.from(providerMap.keys()),
    datasets: [{ label: "Gelir", data: Array.from(providerMap.values()).map((v) => Math.round(v * 100) / 100) }],
  };

  const table: TableRow[] = Array.from(providerMap.entries()).map(([provider, amount]) => ({
    provider,
    amount: Math.round(amount * 100) / 100,
    share: totalIncome > 0 ? Math.round((amount / totalIncome) * 10000) / 100 : 0,
  }));

  return { title: "Finansal Rapor", generatedAt: new Date(), filters: filter, metrics, charts: [chart], table };
}

// ─── Bookings report ────────────────────────────────────

async function getBookingsReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;

  const bookings = await prisma.serviceBooking.findMany({
    where: { createdAt: { gte: dateRange.from, lte: dateRange.to } },
    select: { status: true, packagePrice: true, depositAmount: true, depositPaid: true, serviceSlug: true, guestCount: true },
  });

  const totalBookings = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED" || b.status === "DEPOSIT_PAID").length;
  const totalRevenue = bookings.reduce((s, b) => s + Number(b.packagePrice), 0);
  const avgGuests = totalBookings > 0 ? Math.round(bookings.reduce((s, b) => s + b.guestCount, 0) / totalBookings) : 0;

  const metrics: MetricCard[] = [
    { label: "Toplam Rezervasyon", value: totalBookings, format: "number" },
    { label: "Onaylanan", value: confirmed, format: "number" },
    { label: "Toplam Gelir", value: Math.round(totalRevenue * 100) / 100, format: "currency" },
    { label: "Ort. Misafir", value: avgGuests, format: "number" },
  ];

  const statusMap = new Map<string, number>();
  for (const b of bookings) {
    statusMap.set(b.status, (statusMap.get(b.status) ?? 0) + 1);
  }

  const chart: ChartData = {
    labels: Array.from(statusMap.keys()),
    datasets: [{ label: "Adet", data: Array.from(statusMap.values()) }],
  };

  return { title: "Rezervasyon Raporu", generatedAt: new Date(), filters: filter, metrics, charts: [chart], table: [] };
}

// ─── Stock report ───────────────────────────────────────

async function getStockReport(filter: ReportFilter): Promise<Report> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { name: true, stockCount: true, lowStockAlert: true, basePrice: true, categoryId: true },
    orderBy: { stockCount: "asc" },
  });

  const lowStock = products.filter((p) => p.stockCount != null && p.lowStockAlert != null && p.stockCount <= p.lowStockAlert);
  const outOfStock = products.filter((p) => p.stockCount != null && p.stockCount <= 0);
  const totalStock = products.reduce((s, p) => s + (p.stockCount ?? 0), 0);

  const metrics: MetricCard[] = [
    { label: "Toplam Stok", value: totalStock, format: "number" },
    { label: "Aktif Urun", value: products.length, format: "number" },
    { label: "Dusuk Stok", value: lowStock.length, format: "number" },
    { label: "Stok Tukenen", value: outOfStock.length, format: "number" },
  ];

  const table: TableRow[] = products.map((p) => ({
    name: p.name,
    stock: p.stockCount ?? 0,
    alert: p.lowStockAlert ?? "-",
    price: Number(p.basePrice),
  }));

  return { title: "Stok Raporu", generatedAt: new Date(), filters: filter, metrics, charts: [], table };
}

// ─── GET handler ────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const type = sp.get("type") ?? "sales";
    const filter = buildFilter(sp);

    let report: Report;

    switch (type) {
      case "sales":
        report = await getSalesReport(filter);
        break;
      case "products":
        report = await getProductsReport(filter);
        break;
      case "customers":
        report = await getCustomersReport(filter);
        break;
      case "marketing":
        report = await getMarketingReport(filter);
        break;
      case "delivery":
        report = await getDeliveryReport(filter);
        break;
      case "financial":
        report = await getFinancialReport(filter);
        break;
      case "bookings":
        report = await getBookingsReport(filter);
        break;
      case "stock":
        report = await getStockReport(filter);
        break;
      default:
        return NextResponse.json({ error: "Gecersiz rapor tipi" }, { status: 400 });
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error("[REPORTS API]", error);
    return NextResponse.json({ error: error.message ?? "Sunucu hatasi" }, { status: 500 });
  }
}

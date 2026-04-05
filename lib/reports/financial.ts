import { prisma } from "@/lib/db";
import type { ReportFilter, Report, MetricCard, ChartData, TableRow } from "./types";
import {
  getPreviousPeriod,
  calcChangePercent,
  getTrend,
} from "./helpers";

// Commission rates
const COMMISSION_RATES: Record<string, number> = {
  STRIPE: 0.029,
  IYZICO: 0.0285,
  CASH: 0,
  POS_ON_DELIVERY: 0,
};

export async function getFinancialReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;
  const prevRange = filter.compareWith ?? getPreviousPeriod(dateRange);

  // ── Payments in range ────────────────────────────────
  const payments = await prisma.payment.findMany({
    where: {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
      status: "PAID",
    },
    select: {
      id: true,
      amount: true,
      provider: true,
      method: true,
    },
  });

  const prevPayments = await prisma.payment.findMany({
    where: {
      createdAt: { gte: prevRange.from, lte: prevRange.to },
      status: "PAID",
    },
    select: { amount: true },
  });

  // ── Refunds in range ─────────────────────────────────
  const refunds = await prisma.refund.findMany({
    where: {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
      status: "succeeded",
    },
    select: { amount: true },
  });

  const prevRefunds = await prisma.refund.findMany({
    where: {
      createdAt: { gte: prevRange.from, lte: prevRange.to },
      status: "succeeded",
    },
    select: { amount: true },
  });

  // ── Aggregation ──────────────────────────────────────
  const totalPayments = payments.reduce((s, p) => s + Number(p.amount), 0);
  const totalRefunds = refunds.reduce((s, r) => s + Number(r.amount), 0);

  const prevTotalPayments = prevPayments.reduce(
    (s, p) => s + Number(p.amount),
    0
  );
  const prevTotalRefunds = prevRefunds.reduce(
    (s, r) => s + Number(r.amount),
    0
  );

  // Estimated commission per provider
  const providerAgg = new Map<
    string,
    { count: number; revenue: number; commission: number }
  >();

  for (const p of payments) {
    const provider = p.provider;
    const entry = providerAgg.get(provider) ?? {
      count: 0,
      revenue: 0,
      commission: 0,
    };
    const amount = Number(p.amount);
    entry.count += 1;
    entry.revenue += amount;
    entry.commission += amount * (COMMISSION_RATES[provider] ?? 0);
    providerAgg.set(provider, entry);
  }

  const totalCommission = Array.from(providerAgg.values()).reduce(
    (s, e) => s + e.commission,
    0
  );
  const netRevenue = totalPayments - totalRefunds - totalCommission;
  const prevNetRevenue = prevTotalPayments - prevTotalRefunds;

  // ── Payment method breakdown ─────────────────────────
  const methodAgg = new Map<string, { count: number; revenue: number }>();
  for (const p of payments) {
    const m = p.method;
    const entry = methodAgg.get(m) ?? { count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue += Number(p.amount);
    methodAgg.set(m, entry);
  }

  // ── Metrics ──────────────────────────────────────────
  const metrics: MetricCard[] = [
    {
      label: "Toplam Tahsilat",
      value: Math.round(totalPayments * 100) / 100,
      previousValue: Math.round(prevTotalPayments * 100) / 100,
      changePercent: calcChangePercent(totalPayments, prevTotalPayments),
      trend: getTrend(totalPayments, prevTotalPayments),
      format: "currency",
    },
    {
      label: "Iadeler",
      value: Math.round(totalRefunds * 100) / 100,
      previousValue: Math.round(prevTotalRefunds * 100) / 100,
      changePercent: calcChangePercent(totalRefunds, prevTotalRefunds),
      trend: getTrend(totalRefunds, prevTotalRefunds),
      format: "currency",
    },
    {
      label: "Tahmini Komisyon",
      value: Math.round(totalCommission * 100) / 100,
      format: "currency",
    },
    {
      label: "Net Gelir",
      value: Math.round(netRevenue * 100) / 100,
      previousValue: Math.round(prevNetRevenue * 100) / 100,
      changePercent: calcChangePercent(netRevenue, prevNetRevenue),
      trend: getTrend(netRevenue, prevNetRevenue),
      format: "currency",
    },
  ];

  // ── Provider chart ───────────────────────────────────
  const provEntries = Array.from(providerAgg.entries()).sort(
    (a, b) => b[1].revenue - a[1].revenue
  );
  const providerChart: ChartData = {
    labels: provEntries.map(([name]) => name),
    datasets: [
      {
        label: "Gelir",
        data: provEntries.map(([, d]) => Math.round(d.revenue * 100) / 100),
      },
      {
        label: "Komisyon",
        data: provEntries.map(([, d]) => Math.round(d.commission * 100) / 100),
      },
    ],
  };

  // ── Payment method table ─────────────────────────────
  const table: TableRow[] = Array.from(methodAgg.entries())
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .map(([method, data]) => ({
      method,
      count: data.count,
      revenue: Math.round(data.revenue * 100) / 100,
      share:
        totalPayments > 0
          ? Math.round((data.revenue / totalPayments) * 10000) / 100
          : 0,
    }));

  return {
    title: "Finansal Rapor",
    generatedAt: new Date(),
    filters: filter,
    metrics,
    charts: [providerChart],
    table,
  };
}

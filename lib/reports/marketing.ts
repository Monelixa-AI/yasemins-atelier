import { prisma } from "@/lib/db";
import type { ReportFilter, Report, MetricCard, ChartData, TableRow } from "./types";
import {
  getPreviousPeriod,
  calcChangePercent,
  getTrend,
} from "./helpers";

export async function getMarketingReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;
  const prevRange = filter.compareWith ?? getPreviousPeriod(dateRange);

  // ── Email logs ───────────────────────────────────────
  const [emailCount, prevEmailCount, emailOpened, emailClicked] =
    await Promise.all([
      prisma.emailLog.count({
        where: { createdAt: { gte: dateRange.from, lte: dateRange.to } },
      }),
      prisma.emailLog.count({
        where: { createdAt: { gte: prevRange.from, lte: prevRange.to } },
      }),
      prisma.emailLog.count({
        where: {
          createdAt: { gte: dateRange.from, lte: dateRange.to },
          openedAt: { not: null },
        },
      }),
      prisma.emailLog.count({
        where: {
          createdAt: { gte: dateRange.from, lte: dateRange.to },
          clickedAt: { not: null },
        },
      }),
    ]);

  const openRate = emailCount > 0 ? Math.round((emailOpened / emailCount) * 10000) / 100 : 0;
  const clickRate = emailCount > 0 ? Math.round((emailClicked / emailCount) * 10000) / 100 : 0;

  // ── Discount code usage ──────────────────────────────
  const discountOrders = await prisma.order.findMany({
    where: {
      createdAt: { gte: dateRange.from, lte: dateRange.to },
      paymentStatus: "PAID",
      discountCodeId: { not: null },
    },
    select: {
      discount: true,
      discountCode: { select: { code: true } },
    },
  });

  const discountMap = new Map<string, { count: number; totalDiscount: number }>();
  for (const o of discountOrders) {
    const code = o.discountCode?.code ?? "UNKNOWN";
    const entry = discountMap.get(code) ?? { count: 0, totalDiscount: 0 };
    entry.count += 1;
    entry.totalDiscount += Number(o.discount);
    discountMap.set(code, entry);
  }

  const totalDiscountUsage = discountOrders.length;
  const totalDiscountAmount = discountOrders.reduce(
    (s, o) => s + Number(o.discount),
    0
  );

  // ── UTM click source breakdown ───────────────────────
  const utmClicks = await prisma.uTMClick.findMany({
    where: { createdAt: { gte: dateRange.from, lte: dateRange.to } },
    select: { source: true, medium: true, campaign: true },
  });

  const sourceMap = new Map<string, number>();
  for (const c of utmClicks) {
    const src = c.source ?? "direct";
    sourceMap.set(src, (sourceMap.get(src) ?? 0) + 1);
  }

  // ── Referral status breakdown ────────────────────────
  const referrals = await prisma.referral.findMany({
    where: { createdAt: { gte: dateRange.from, lte: dateRange.to } },
    select: { status: true },
  });

  const refMap = new Map<string, number>();
  for (const r of referrals) {
    refMap.set(r.status, (refMap.get(r.status) ?? 0) + 1);
  }

  // ── Popup conversion rates ───────────────────────────
  const popups = await prisma.popup.findMany({
    where: { isActive: true },
    select: { id: true, name: true, impressions: true, conversions: true },
  });

  // ── Metrics ──────────────────────────────────────────
  const metrics: MetricCard[] = [
    {
      label: "Gonderilen E-posta",
      value: emailCount,
      previousValue: prevEmailCount,
      changePercent: calcChangePercent(emailCount, prevEmailCount),
      trend: getTrend(emailCount, prevEmailCount),
      format: "number",
    },
    { label: "Acilma Orani", value: openRate, format: "percent" },
    { label: "Tiklama Orani", value: clickRate, format: "percent" },
    { label: "Indirim Kullanimi", value: totalDiscountUsage, format: "number" },
    {
      label: "Indirim Tutari",
      value: Math.round(totalDiscountAmount * 100) / 100,
      format: "currency",
    },
    { label: "UTM Tiklama", value: utmClicks.length, format: "number" },
    { label: "Referans", value: referrals.length, format: "number" },
  ];

  // ── UTM source chart ─────────────────────────────────
  const srcEntries = Array.from(sourceMap.entries()).sort((a, b) => b[1] - a[1]);
  const utmChart: ChartData = {
    labels: srcEntries.map(([src]) => src),
    datasets: [{ label: "Tiklama", data: srcEntries.map(([, c]) => c) }],
  };

  // ── Referral chart ───────────────────────────────────
  const refEntries = Array.from(refMap.entries());
  const refChart: ChartData = {
    labels: refEntries.map(([s]) => s),
    datasets: [{ label: "Adet", data: refEntries.map(([, c]) => c) }],
  };

  // ── Table: Discount codes + Popup conversions ────────
  const discountTable: TableRow[] = Array.from(discountMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([code, data]) => ({
      type: "discount",
      code,
      count: data.count,
      totalDiscount: Math.round(data.totalDiscount * 100) / 100,
    }));

  const popupTable: TableRow[] = popups.map((p) => ({
    type: "popup",
    name: p.name,
    impressions: p.impressions,
    conversions: p.conversions,
    conversionRate:
      p.impressions > 0
        ? Math.round((p.conversions / p.impressions) * 10000) / 100
        : 0,
  }));

  return {
    title: "Pazarlama Raporu",
    generatedAt: new Date(),
    filters: filter,
    metrics,
    charts: [utmChart, refChart],
    table: [...discountTable, ...popupTable],
  };
}

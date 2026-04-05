import { prisma } from "@/lib/db";
import {
  subMonths,
  subDays,
  startOfMonth,
  endOfMonth,
  format,
} from "date-fns";
import { tr } from "date-fns/locale";
import type { ReportFilter, Report, MetricCard, ChartData, TableRow } from "./types";
import {
  getPreviousPeriod,
  calcChangePercent,
  getTrend,
} from "./helpers";

// ─────────────────────────────────────────────────────────
// 1. Customer Lifetime Value Report
// ─────────────────────────────────────────────────────────

export async function getCLVReport(filter: ReportFilter): Promise<Report> {
  const { dateRange } = filter;

  // Users who have at least one paid order
  const users = await prisma.user.findMany({
    where: {
      orders: {
        some: {
          paymentStatus: "PAID",
          createdAt: { lte: dateRange.to },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      loyaltyTier: true,
      totalSpent: true,
      orderCount: true,
    },
  });

  if (users.length === 0) {
    return emptyReport("Musteri Yasam Boyu Degeri", filter);
  }

  const totalCLV = users.reduce((s, u) => s + Number(u.totalSpent), 0);
  const avgCLV = totalCLV / users.length;

  // Tier breakdown
  const tierMap = new Map<string, { count: number; revenue: number }>();
  for (const u of users) {
    const t = u.loyaltyTier;
    const entry = tierMap.get(t) ?? { count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue += Number(u.totalSpent);
    tierMap.set(t, entry);
  }

  // Frequency distribution
  const freq = { "1": 0, "2-5": 0, "6-10": 0, "10+": 0 };
  for (const u of users) {
    const c = u.orderCount;
    if (c <= 1) freq["1"]++;
    else if (c <= 5) freq["2-5"]++;
    else if (c <= 10) freq["6-10"]++;
    else freq["10+"]++;
  }

  const metrics: MetricCard[] = [
    { label: "Toplam Musteri", value: users.length, format: "number" },
    { label: "Ortalama CLV", value: Math.round(avgCLV * 100) / 100, format: "currency" },
    { label: "Toplam CLV", value: Math.round(totalCLV * 100) / 100, format: "currency" },
  ];

  // Tier chart
  const tiers = ["BRONZE", "SILVER", "GOLD"];
  const tierChart: ChartData = {
    labels: tiers,
    datasets: [
      { label: "Musteri", data: tiers.map((t) => tierMap.get(t)?.count ?? 0) },
      { label: "Gelir", data: tiers.map((t) => Math.round((tierMap.get(t)?.revenue ?? 0) * 100) / 100) },
    ],
  };

  // Frequency chart
  const freqLabels = Object.keys(freq);
  const freqChart: ChartData = {
    labels: freqLabels,
    datasets: [{ label: "Musteri Sayisi", data: freqLabels.map((k) => freq[k as keyof typeof freq]) }],
  };

  // Top 20 by totalSpent
  const top20 = [...users]
    .sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent))
    .slice(0, 20);

  const table: TableRow[] = top20.map((u) => ({
    userId: u.id,
    name: u.name ?? "-",
    email: u.email,
    tier: u.loyaltyTier,
    orderCount: u.orderCount,
    totalSpent: Math.round(Number(u.totalSpent) * 100) / 100,
  }));

  return {
    title: "Musteri Yasam Boyu Degeri",
    generatedAt: new Date(),
    filters: filter,
    metrics,
    charts: [tierChart, freqChart],
    table,
  };
}

// ─────────────────────────────────────────────────────────
// 2. Cohort Retention Report (last 6 months)
// ─────────────────────────────────────────────────────────

export async function getCohortReport(): Promise<Report> {
  const now = new Date();
  const cohortMonths = 6;
  const cohorts: { label: string; from: Date; to: Date }[] = [];

  for (let i = cohortMonths - 1; i >= 0; i--) {
    const ref = subMonths(now, i);
    cohorts.push({
      label: format(startOfMonth(ref), "MMM yyyy", { locale: tr }),
      from: startOfMonth(ref),
      to: endOfMonth(ref),
    });
  }

  // Fetch users created in the cohort window
  const allUsers = await prisma.user.findMany({
    where: {
      createdAt: { gte: cohorts[0].from, lte: cohorts[cohorts.length - 1].to },
    },
    select: { id: true, createdAt: true },
  });

  // Fetch orders for these users
  const userIds = allUsers.map((u) => u.id);
  const orders = await prisma.order.findMany({
    where: {
      userId: { in: userIds },
      paymentStatus: "PAID",
    },
    select: { userId: true, createdAt: true },
  });

  // Group users by cohort month
  const userCohortMap = new Map<string, Set<string>>();
  for (const c of cohorts) {
    userCohortMap.set(c.label, new Set());
  }
  for (const u of allUsers) {
    for (const c of cohorts) {
      if (u.createdAt >= c.from && u.createdAt <= c.to) {
        userCohortMap.get(c.label)!.add(u.id);
        break;
      }
    }
  }

  // Build retention table
  const table: TableRow[] = [];
  for (let ci = 0; ci < cohorts.length; ci++) {
    const cohort = cohorts[ci];
    const cohortUserIds = userCohortMap.get(cohort.label)!;
    const cohortSize = cohortUserIds.size;

    const row: TableRow = { cohort: cohort.label, users: cohortSize };

    for (let mi = 0; mi < cohorts.length - ci; mi++) {
      const targetMonth = cohorts[ci + mi];
      if (!targetMonth) break;

      const activeUsers = new Set<string>();
      for (const o of orders) {
        if (
          o.userId &&
          cohortUserIds.has(o.userId) &&
          o.createdAt >= targetMonth.from &&
          o.createdAt <= targetMonth.to
        ) {
          activeUsers.add(o.userId);
        }
      }

      row[`month_${mi}`] =
        cohortSize > 0
          ? Math.round((activeUsers.size / cohortSize) * 10000) / 100
          : 0;
    }

    table.push(row);
  }

  const dummyFilter: ReportFilter = {
    dateRange: { from: cohorts[0].from, to: cohorts[cohorts.length - 1].to },
  };

  return {
    title: "Kohort Tutundurma Raporu",
    generatedAt: new Date(),
    filters: dummyFilter,
    metrics: [
      { label: "Kohort Sayisi", value: cohorts.length, format: "number" },
      { label: "Toplam Yeni Musteri", value: allUsers.length, format: "number" },
    ],
    table,
  };
}

// ─────────────────────────────────────────────────────────
// 3. Churn Risk Report
// ─────────────────────────────────────────────────────────

type ChurnSegment = "Active" | "AtRisk" | "Churned" | "Lost";

export async function getChurnRiskReport(): Promise<Report> {
  const now = new Date();
  const d30 = subDays(now, 30);
  const d60 = subDays(now, 60);
  const d90 = subDays(now, 90);

  // Users with at least one paid order, fetching their most recent paid order date
  const users = await prisma.user.findMany({
    where: { orders: { some: { paymentStatus: "PAID" } } },
    select: {
      id: true,
      name: true,
      email: true,
      totalSpent: true,
      orderCount: true,
      orders: {
        where: { paymentStatus: "PAID" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  const classify = (lastOrder: Date): ChurnSegment => {
    if (lastOrder >= d30) return "Active";
    if (lastOrder >= d60) return "AtRisk";
    if (lastOrder >= d90) return "Churned";
    return "Lost";
  };

  const segments: Record<ChurnSegment, { count: number; revenue: number }> = {
    Active: { count: 0, revenue: 0 },
    AtRisk: { count: 0, revenue: 0 },
    Churned: { count: 0, revenue: 0 },
    Lost: { count: 0, revenue: 0 },
  };

  type UserWithSegment = {
    id: string;
    name: string | null;
    email: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: Date;
    segment: ChurnSegment;
  };

  const enriched: UserWithSegment[] = [];

  for (const u of users) {
    const lastOrderDate = u.orders[0]?.createdAt ?? new Date(0);
    const segment = classify(lastOrderDate);
    segments[segment].count += 1;
    segments[segment].revenue += Number(u.totalSpent);
    enriched.push({
      id: u.id,
      name: u.name,
      email: u.email,
      totalSpent: Number(u.totalSpent),
      orderCount: u.orderCount,
      lastOrderDate,
      segment,
    });
  }

  const metrics: MetricCard[] = (
    ["Active", "AtRisk", "Churned", "Lost"] as ChurnSegment[]
  ).map((seg) => ({
    label: seg,
    value: segments[seg].count,
    format: "number" as const,
  }));

  const segChart: ChartData = {
    labels: ["Active", "AtRisk", "Churned", "Lost"],
    datasets: [
      {
        label: "Musteri",
        data: ["Active", "AtRisk", "Churned", "Lost"].map(
          (s) => segments[s as ChurnSegment].count
        ),
      },
    ],
  };

  // Top 50 at-risk users sorted by totalSpent desc
  const atRisk = enriched
    .filter((u) => u.segment === "AtRisk")
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 50);

  const table: TableRow[] = atRisk.map((u) => ({
    userId: u.id,
    name: u.name ?? "-",
    email: u.email,
    segment: u.segment,
    orderCount: u.orderCount,
    totalSpent: Math.round(u.totalSpent * 100) / 100,
    lastOrderDate: format(u.lastOrderDate, "d MMM yyyy", { locale: tr }),
  }));

  const dummyFilter: ReportFilter = {
    dateRange: { from: d90, to: now },
  };

  return {
    title: "Kayip Riski Raporu",
    generatedAt: new Date(),
    filters: dummyFilter,
    metrics,
    charts: [segChart],
    table,
  };
}

// ── Helper ─────────────────────────────────────────────
function emptyReport(title: string, filter: ReportFilter): Report {
  return {
    title,
    generatedAt: new Date(),
    filters: filter,
    metrics: [],
    charts: [],
    table: [],
  };
}

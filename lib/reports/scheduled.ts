import React from "react";
import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from "date-fns";
import { tr } from "date-fns/locale";

import { sendEmail } from "@/lib/email";
import { formatCurrency } from "./helpers";
import { getSalesReport } from "./sales";
import { getProductReport } from "./products";
import { getFinancialReport } from "./financial";
import type { ReportFilter } from "./types";

import WeeklyReportEmail from "@/emails/WeeklyReportEmail";
import MonthlyReportEmail from "@/emails/MonthlyReportEmail";

// ─── WEEKLY REPORT ────────────────────────────────────

export async function sendWeeklyReport(): Promise<boolean> {
  const now = new Date();
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

  const filter: ReportFilter = {
    dateRange: { from: lastWeekStart, to: lastWeekEnd },
    groupBy: "day",
  };

  const [salesReport, productReport] = await Promise.all([
    getSalesReport(filter),
    getProductReport(filter),
  ]);

  // Extract key metrics
  const totalRevenue =
    salesReport.metrics.find((m) => m.label === "Toplam Gelir")?.value ?? 0;
  const totalOrders =
    salesReport.metrics.find((m) => m.label === "Siparis Sayisi")?.value ?? 0;
  const avgOrderValue =
    salesReport.metrics.find((m) => m.label === "Ortalama Siparis")?.value ?? 0;

  // Top product from product report table
  const topProduct =
    productReport.table && productReport.table.length > 0
      ? productReport.table[0].name
      : "-";

  const dateRangeStr = `${format(lastWeekStart, "d MMM", { locale: tr })} - ${format(lastWeekEnd, "d MMM yyyy", { locale: tr })}`;
  const subject = `Haftalik Rapor \u2014 ${dateRangeStr}`;

  const adminEmail = process.env.ADMIN_REPORT_EMAIL;
  if (!adminEmail) {
    console.error("ADMIN_REPORT_EMAIL env degiskeni tanimli degil");
    return false;
  }

  const template = React.createElement(WeeklyReportEmail, {
    totalRevenue: formatCurrency(totalRevenue),
    totalOrders,
    avgOrderValue: formatCurrency(avgOrderValue),
    topProduct,
    dateRange: dateRangeStr,
  });

  return sendEmail(adminEmail, subject, template);
}

// ─── MONTHLY REPORT ───────────────────────────────────

export async function sendMonthlyReport(): Promise<boolean> {
  const now = new Date();
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const filter: ReportFilter = {
    dateRange: { from: lastMonthStart, to: lastMonthEnd },
    groupBy: "day",
  };

  const [salesReport, productReport, financialReport] = await Promise.all([
    getSalesReport(filter),
    getProductReport(filter),
    getFinancialReport(filter),
  ]);

  // Extract key metrics
  const totalRevenue =
    salesReport.metrics.find((m) => m.label === "Toplam Gelir")?.value ?? 0;
  const totalOrders =
    salesReport.metrics.find((m) => m.label === "Siparis Sayisi")?.value ?? 0;
  const avgOrderValue =
    salesReport.metrics.find((m) => m.label === "Ortalama Siparis")?.value ?? 0;
  const netRevenue =
    financialReport.metrics.find((m) => m.label === "Net Gelir")?.value ?? 0;
  const totalRefunds =
    financialReport.metrics.find((m) => m.label === "Iadeler")?.value ?? 0;

  // Top product
  const topProduct =
    productReport.table && productReport.table.length > 0
      ? productReport.table[0].name
      : "-";

  const monthYear = format(lastMonthStart, "MMMM yyyy", { locale: tr });
  const subject = `Aylik Rapor \u2014 ${monthYear}`;

  const adminEmail = process.env.ADMIN_REPORT_EMAIL;
  if (!adminEmail) {
    console.error("ADMIN_REPORT_EMAIL env degiskeni tanimli degil");
    return false;
  }

  const template = React.createElement(MonthlyReportEmail, {
    totalRevenue: formatCurrency(totalRevenue),
    totalOrders,
    avgOrderValue: formatCurrency(avgOrderValue),
    topProduct,
    netRevenue: formatCurrency(netRevenue),
    totalRefunds: formatCurrency(totalRefunds),
    dateRange: monthYear,
  });

  return sendEmail(adminEmail, subject, template);
}

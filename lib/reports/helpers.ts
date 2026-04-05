import {
  format,
  subDays,
  startOfWeek,
  getISOWeek,
  differenceInDays,
} from "date-fns";
import { tr } from "date-fns/locale";
import type { DateRange } from "./types";

/**
 * Calculate the previous period of equal length for comparison.
 * E.g. if range is 7 days, returns the preceding 7 days.
 */
export function getPreviousPeriod(range: DateRange): DateRange {
  const days = differenceInDays(range.to, range.from) + 1;
  return {
    from: subDays(range.from, days),
    to: subDays(range.from, 1),
  };
}

/**
 * Percentage change between two values.
 * Returns 0 when previous is 0 (avoids division by zero).
 */
export function calcChangePercent(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 10000) / 100;
}

/**
 * Format a number as Turkish Lira currency string.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Determine trend direction from two values.
 */
export function getTrend(
  current: number,
  previous: number
): "up" | "down" | "flat" {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "flat";
}

/**
 * Format a date for chart labels based on groupBy granularity.
 * Uses Turkish locale.
 */
export function formatGroupDate(
  date: Date,
  groupBy: "day" | "week" | "month"
): string {
  switch (groupBy) {
    case "day":
      return format(date, "d MMM", { locale: tr });
    case "week": {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekNum = getISOWeek(date);
      return `H${weekNum} (${format(weekStart, "d MMM", { locale: tr })})`;
    }
    case "month":
      return format(date, "MMMM yyyy", { locale: tr });
  }
}

// ─── REPORTING ENGINE — TYPE DEFINITIONS ───────────────

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ReportFilter {
  dateRange: DateRange;
  compareWith?: DateRange;
  groupBy?: "day" | "week" | "month";
  categoryId?: string;
}

export interface MetricCard {
  label: string;
  value: number;
  previousValue?: number;
  changePercent?: number;
  trend?: "up" | "down" | "flat";
  format?: "currency" | "number" | "percent";
}

export interface ChartDataset {
  label: string;
  data: number[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface TableRow {
  [key: string]: any;
}

export interface Report {
  title: string;
  generatedAt: Date;
  filters: ReportFilter;
  metrics: MetricCard[];
  charts?: ChartData[];
  table?: TableRow[];
}

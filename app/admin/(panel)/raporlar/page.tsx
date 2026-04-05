"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfDay } from "date-fns";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ReportFilters, type FilterState } from "@/components/admin/reports/ReportFilters";
import { ReportMetricCard } from "@/components/admin/reports/ReportMetricCard";
import { ReportChart } from "@/components/admin/reports/ReportChart";
import { ReportTable } from "@/components/admin/reports/ReportTable";
import { ReportExport } from "@/components/admin/reports/ReportExport";
import type { Report } from "@/lib/reports/types";

// ─── Tab definitions ────────────────────────────────────

const TABS = [
  { key: "sales",     label: "Satis",          chartType: "line" as const },
  { key: "products",  label: "Urunler",        chartType: "bar"  as const },
  { key: "customers", label: "Musteriler",     chartType: "pie"  as const },
  { key: "marketing", label: "Pazarlama",      chartType: "bar"  as const },
  { key: "delivery",  label: "Teslimat",       chartType: "pie"  as const },
  { key: "financial", label: "Finansal",       chartType: "bar"  as const },
  { key: "bookings",  label: "Rezervasyonlar", chartType: "pie"  as const },
  { key: "stock",     label: "Stok",           chartType: "bar"  as const },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Table header mappings per tab ──────────────────────

const TABLE_HEADERS: Record<TabKey, { key: string; label: string; format?: "currency" | "percent" | "number" }[]> = {
  sales:     [{ key: "method", label: "Odeme Yontemi" }, { key: "count", label: "Adet", format: "number" }, { key: "revenue", label: "Gelir", format: "currency" }, { key: "share", label: "Pay", format: "percent" }],
  products:  [{ key: "name", label: "Urun" }, { key: "quantity", label: "Adet", format: "number" }, { key: "revenue", label: "Gelir", format: "currency" }, { key: "share", label: "Pay", format: "percent" }],
  customers: [{ key: "tier", label: "Seviye" }, { key: "count", label: "Musteri", format: "number" }],
  marketing: [{ key: "code", label: "Kupon Kodu" }, { key: "type", label: "Tip" }, { key: "value", label: "Deger", format: "number" }, { key: "usedCount", label: "Kullanim", format: "number" }],
  delivery:  [{ key: "zone", label: "Bolge" }, { key: "count", label: "Siparis", format: "number" }],
  financial: [{ key: "provider", label: "Saglayici" }, { key: "amount", label: "Tutar", format: "currency" }, { key: "share", label: "Pay", format: "percent" }],
  bookings:  [{ key: "status", label: "Durum" }, { key: "count", label: "Adet", format: "number" }],
  stock:     [{ key: "name", label: "Urun" }, { key: "stock", label: "Stok", format: "number" }, { key: "alert", label: "Uyari Limiti" }, { key: "price", label: "Fiyat", format: "currency" }],
};

// ─── Skeleton loader ────────────────────────────────────

function MetricSkeleton() {
  return (
    <div className="bg-white border rounded-xl p-5 animate-pulse">
      <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
      <div className="h-7 w-32 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-16 bg-gray-100 rounded" />
    </div>
  );
}

// ─── Page component ─────────────────────────────────────

export default function RaporlarPage() {
  const [tab, setTab] = useState<TabKey>("sales");
  const [filter, setFilter] = useState<FilterState>({
    from: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    to: format(endOfDay(new Date()), "yyyy-MM-dd"),
    groupBy: "day",
    compare: false,
  });
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: tab,
        from: filter.from,
        to: filter.to,
        groupBy: filter.groupBy,
        compare: String(filter.compare),
      });
      const res = await fetch(`/api/admin/reports?${params}`);
      if (!res.ok) throw new Error("Rapor alinamadi");
      const data: Report = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [tab, filter]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const activeTab = TABS.find((t) => t.key === tab)!;
  const headers = TABLE_HEADERS[tab];
  const exportFilename = `rapor-${tab}-${filter.from}-${filter.to}`;

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Raporlar"
        breadcrumb={["Sistem", "Raporlar"]}
        actions={
          report?.table && report.table.length > 0 ? (
            <ReportExport headers={headers} rows={report.table} filename={exportFilename} />
          ) : undefined
        }
      />

      {/* Filters */}
      <ReportFilters filter={filter} onChange={setFilter} />

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.key
                ? "border-terracotta text-terracotta"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)
          : report?.metrics.map((m, i) => <ReportMetricCard key={i} {...m} />)}
      </div>

      {/* Charts */}
      {!loading && report?.charts && report.charts.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {report.charts.map((chart, i) => (
            <div key={i} className="bg-white border rounded-xl p-5">
              <ReportChart data={chart} type={activeTab.chartType} />
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="bg-white border rounded-xl p-5 animate-pulse">
          <div className="h-[300px] bg-gray-100 rounded" />
        </div>
      )}

      {/* Table */}
      {!loading && report?.table && report.table.length > 0 && (
        <ReportTable headers={headers} rows={report.table} />
      )}

      {loading && (
        <div className="bg-white border rounded-xl p-4 animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-gray-100 rounded" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && report && (!report.table || report.table.length === 0) && (!report.charts || report.charts.length === 0) && report.metrics.every((m) => m.value === 0) && (
        <div className="bg-white border rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm">Secilen tarih araliginda veri bulunamadi.</p>
        </div>
      )}
    </div>
  );
}

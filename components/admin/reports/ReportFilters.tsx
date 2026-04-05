"use client";

import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  format,
} from "date-fns";

export interface FilterState {
  from: string;
  to: string;
  groupBy: "day" | "week" | "month";
  compare: boolean;
}

interface ReportFiltersProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
}

const toStr = (d: Date) => format(d, "yyyy-MM-dd");

const quickRanges: { label: string; from: () => Date; to: () => Date }[] = [
  { label: "Bugun", from: () => startOfDay(new Date()), to: () => endOfDay(new Date()) },
  { label: "Bu Hafta", from: () => startOfWeek(new Date(), { weekStartsOn: 1 }), to: () => endOfWeek(new Date(), { weekStartsOn: 1 }) },
  { label: "Bu Ay", from: () => startOfMonth(new Date()), to: () => endOfMonth(new Date()) },
  { label: "Gecen Ay", from: () => startOfMonth(subMonths(new Date(), 1)), to: () => endOfMonth(subMonths(new Date(), 1)) },
  { label: "Son 90 Gun", from: () => subDays(new Date(), 89), to: () => endOfDay(new Date()) },
];

const groupByOptions: { label: string; value: "day" | "week" | "month" }[] = [
  { label: "Gun", value: "day" },
  { label: "Hafta", value: "week" },
  { label: "Ay", value: "month" },
];

export function ReportFilters({ filter, onChange }: ReportFiltersProps) {
  const set = (patch: Partial<FilterState>) =>
    onChange({ ...filter, ...patch });

  return (
    <div className="bg-white border rounded-xl p-4 space-y-4">
      {/* Date inputs */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Baslangic</label>
          <input
            type="date"
            value={filter.from}
            onChange={(e) => set({ from: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Bitis</label>
          <input
            type="date"
            value={filter.to}
            onChange={(e) => set({ to: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta"
          />
        </div>

        {/* Quick range buttons */}
        <div className="flex flex-wrap gap-1.5">
          {quickRanges.map((qr) => (
            <button
              key={qr.label}
              type="button"
              onClick={() => set({ from: toStr(qr.from()), to: toStr(qr.to()) })}
              className="px-3 py-2 text-xs rounded-lg border hover:bg-gray-50 text-gray-600 transition-colors"
            >
              {qr.label}
            </button>
          ))}
        </div>
      </div>

      {/* GroupBy + Compare */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Gruplama:</span>
          {groupByOptions.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => set({ groupBy: g.value })}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                filter.groupBy === g.value
                  ? "bg-terracotta text-white border-terracotta"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.compare}
            onChange={(e) => set({ compare: e.target.checked })}
            className="rounded border-gray-300 text-terracotta focus:ring-terracotta"
          />
          Onceki donemle karsilastir
        </label>
      </div>
    </div>
  );
}

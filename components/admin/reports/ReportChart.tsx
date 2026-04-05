"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { ChartData } from "@/lib/reports/types";

interface ReportChartProps {
  data: ChartData;
  type: "line" | "bar" | "pie";
}

const COLORS = [
  "#C4622D", // terracotta
  "#B8975C", // gold
  "#3D1A0A", // brown-deep
  "#8B3E18", // terracotta-dark
  "#E8D5A3", // gold-light
  "#6B3520", // brown-mid
];

function formatTR(val: number): string {
  return val.toLocaleString("tr-TR");
}

export function ReportChart({ data, type }: ReportChartProps) {
  // Transform data for Recharts
  const chartData = data.labels.map((label, i) => {
    const point: Record<string, any> = { name: label };
    data.datasets.forEach((ds) => {
      point[ds.label] = ds.data[i] ?? 0;
    });
    return point;
  });

  if (type === "pie") {
    // Pie chart uses the first dataset only
    const ds = data.datasets[0];
    const pieData = data.labels.map((label, i) => ({
      name: label,
      value: ds?.data[i] ?? 0,
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }: { name?: string; percent?: number }) =>
              `${name ?? ""} (%${((percent ?? 0) * 100).toFixed(0)})`
            }
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => formatTR(Number(v))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} tickFormatter={formatTR} />
          <Tooltip formatter={(v) => formatTR(Number(v))} />
          <Legend />
          {data.datasets.map((ds, i) => (
            <Bar
              key={ds.label}
              dataKey={ds.label}
              fill={COLORS[i % COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // Default: line
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={12} />
        <YAxis fontSize={12} tickFormatter={formatTR} />
        <Tooltip formatter={(v) => formatTR(Number(v))} />
        <Legend />
        {data.datasets.map((ds, i) => (
          <Line
            key={ds.label}
            type="monotone"
            dataKey={ds.label}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

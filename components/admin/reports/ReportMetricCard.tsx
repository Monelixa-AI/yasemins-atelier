import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/reports/helpers";

interface ReportMetricCardProps {
  label: string;
  value: number;
  previousValue?: number;
  changePercent?: number;
  trend?: "up" | "down" | "flat";
  format?: "currency" | "number" | "percent";
}

function formatValue(value: number, fmt?: string): string {
  switch (fmt) {
    case "currency":
      return formatCurrency(value);
    case "percent":
      return `%${value.toLocaleString("tr-TR")}`;
    case "number":
    default:
      return value.toLocaleString("tr-TR");
  }
}

export function ReportMetricCard({
  label,
  value,
  previousValue,
  changePercent,
  trend,
  format,
}: ReportMetricCardProps) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold text-brown-deep">
        {formatValue(value, format)}
      </p>

      {changePercent != null && trend && (
        <div className="flex items-center gap-1.5 mt-2">
          {trend === "up" && (
            <TrendingUp size={14} className="text-green-600" />
          )}
          {trend === "down" && (
            <TrendingDown size={14} className="text-red-500" />
          )}
          {trend === "flat" && (
            <Minus size={14} className="text-gray-400" />
          )}
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-green-600"
                : trend === "down"
                  ? "text-red-500"
                  : "text-gray-400"
            }`}
          >
            %{Math.abs(changePercent).toLocaleString("tr-TR")}
          </span>
        </div>
      )}

      {previousValue != null && (
        <p className="text-[11px] text-gray-400 mt-1">
          Onceki: {formatValue(previousValue, format)}
        </p>
      )}
    </div>
  );
}

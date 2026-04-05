"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/reports/helpers";

interface TableHeader {
  key: string;
  label: string;
  format?: "currency" | "percent" | "number";
}

interface ReportTableProps {
  headers: TableHeader[];
  rows: Record<string, any>[];
  totals?: Record<string, any>;
}

function formatCell(value: any, fmt?: string): string {
  if (value == null) return "-";
  switch (fmt) {
    case "currency":
      return formatCurrency(Number(value));
    case "percent":
      return `%${Number(value).toLocaleString("tr-TR")}`;
    case "number":
      return Number(value).toLocaleString("tr-TR");
    default:
      return String(value);
  }
}

export function ReportTable({ headers, rows, totals }: ReportTableProps) {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = [...rows].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey];
    const bv = b[sortKey];
    const numA = Number(av);
    const numB = Number(bv);
    const isNum = !isNaN(numA) && !isNaN(numB);
    const cmp = isNum ? numA - numB : String(av).localeCompare(String(bv), "tr");
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b">
            {headers.map((h) => (
              <th
                key={h.key}
                onClick={() => handleSort(h.key)}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700"
              >
                <span className="inline-flex items-center gap-1">
                  {h.label}
                  {sortKey === h.key &&
                    (sortDir === "asc" ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr
              key={i}
              className="border-b last:border-b-0 hover:bg-gray-50/50"
            >
              {headers.map((h) => (
                <td key={h.key} className="px-4 py-3 text-gray-700">
                  {formatCell(row[h.key], h.format)}
                </td>
              ))}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-8 text-center text-gray-400"
              >
                Veri bulunamadi
              </td>
            </tr>
          )}
        </tbody>
        {totals && (
          <tfoot>
            <tr className="bg-cream font-semibold border-t">
              {headers.map((h) => (
                <td key={h.key} className="px-4 py-3 text-gray-900">
                  {totals[h.key] != null ? formatCell(totals[h.key], h.format) : ""}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

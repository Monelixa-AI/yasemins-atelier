"use client";

import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/export/csv";
import { exportToExcel } from "@/lib/export/excel";

interface ReportExportProps {
  headers: { key: string; label: string }[];
  rows: Record<string, any>[];
  filename: string;
}

export function ReportExport({ headers, rows, filename }: ReportExportProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => exportToCSV(headers, rows, filename)}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Download size={14} />
        CSV Indir
      </button>
      <button
        onClick={() => exportToExcel(headers, rows, filename)}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Download size={14} />
        Excel Indir
      </button>
    </div>
  );
}

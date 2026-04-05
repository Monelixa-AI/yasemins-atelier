import * as XLSX from "xlsx";

/**
 * Export data as an Excel (.xlsx) file.
 */
export function exportToExcel(
  headers: { key: string; label: string }[],
  rows: Record<string, any>[],
  filename: string,
  sheetName?: string
) {
  const wsData = [
    headers.map((h) => h.label),
    ...rows.map((row) => headers.map((h) => row[h.key] ?? "")),
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Auto-size columns based on header lengths
  ws["!cols"] = headers.map((h) => ({ wch: Math.max(h.label.length + 4, 14) }));

  XLSX.utils.book_append_sheet(wb, ws, sheetName ?? "Rapor");
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

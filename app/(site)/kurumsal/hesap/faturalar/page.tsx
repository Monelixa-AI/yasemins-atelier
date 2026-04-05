"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Search } from "lucide-react";

interface Invoice {
  id: string;
  period: string;
  invoiceNo: string;
  orderCount: number;
  total: string;
  status: string;
  pdfUrl: string;
}

const statusMap: Record<string, { label: string; cls: string }> = {
  PAID: { label: "Ödendi", cls: "bg-green-100 text-green-700" },
  PENDING: { label: "Bekliyor", cls: "bg-yellow-100 text-yellow-700" },
  OVERDUE: { label: "Gecikmiş", cls: "bg-red-100 text-red-700" },
  CANCELLED: { label: "İptal", cls: "bg-gray-100 text-gray-500" },
};

export default function FaturalarPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/corporate/invoices")
      .then((r) => r.json())
      .then((d) => setInvoices(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? invoices.filter(
        (inv) =>
          inv.invoiceNo.toLowerCase().includes(filter.toLowerCase()) ||
          inv.period.toLowerCase().includes(filter.toLowerCase())
      )
    : invoices;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FileText size={28} className="text-[#C4622D]" />
          <h1 className="font-heading text-3xl text-[#3D1A0A]">Faturalarım</h1>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#B8975C]/20 px-3 py-2 bg-white w-64">
          <Search size={14} className="text-[#3D1A0A]/30" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 font-body text-sm focus:outline-none"
            placeholder="Fatura no veya dönem ara..."
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#B8975C]/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-7 h-7 border-2 border-[#C4622D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={48} className="text-[#B8975C]/30 mx-auto mb-3" />
            <p className="font-body text-sm text-[#3D1A0A]/50">
              {filter ? "Aramayla eşleşen fatura bulunamadı" : "Henüz fatura yok"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-[#B8975C]/10 bg-[#FDF6EE]/50">
                  <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">
                    Dönem
                  </th>
                  <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">
                    Fatura No
                  </th>
                  <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">
                    Sipariş Sayısı
                  </th>
                  <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">
                    Toplam
                  </th>
                  <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-4 py-3 font-body text-xs text-[#3D1A0A]/50 uppercase tracking-wider">
                    İşlem
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => {
                  const st = statusMap[inv.status] || {
                    label: inv.status,
                    cls: "bg-gray-100 text-gray-600",
                  };
                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-[#B8975C]/5 last:border-0 hover:bg-[#FDF6EE]/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]">
                        {inv.period}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]/70 font-mono">
                        {inv.invoiceNo}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-[#3D1A0A]/60">
                        {inv.orderCount}
                      </td>
                      <td className="px-4 py-3 font-body text-sm text-[#3D1A0A] font-medium">
                        {inv.total}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${st.cls}`}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#C4622D] hover:text-[#C4622D]/80 font-body text-sm transition-colors"
                        >
                          <Download size={14} />
                          PDF İndir
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

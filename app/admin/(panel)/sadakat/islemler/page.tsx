"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  Loader2, Search, ArrowDownCircle, ArrowUpCircle,
  ChevronLeft, ChevronRight, Inbox, UserPlus,
} from "lucide-react"

/* ---------- Types ---------- */

type TransactionType =
  | "PURCHASE"
  | "BIRTHDAY"
  | "REVIEW"
  | "PHOTO_REVIEW"
  | "REFERRAL"
  | "REDEMPTION"
  | "MANUAL"
  | "EXPIRED"
  | "FIRST_ORDER"
  | "NEWSLETTER"
  | "PROFILE_COMPLETE"

interface Transaction {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: TransactionType
  points: number
  description: string | null
  expiresAt: string | null
  createdAt: string
}

interface Filters {
  search: string
  type: string
  dateFrom: string
  dateTo: string
}

/* ---------- Constants ---------- */

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tüm Tipler" },
  { value: "PURCHASE", label: "Satın Alma" },
  { value: "BIRTHDAY", label: "Doğum Günü" },
  { value: "REVIEW", label: "Yorum" },
  { value: "PHOTO_REVIEW", label: "Fotoğraflı Yorum" },
  { value: "REFERRAL", label: "Referral" },
  { value: "REDEMPTION", label: "Kullanım" },
  { value: "MANUAL", label: "Manuel" },
  { value: "EXPIRED", label: "Süresi Dolmuş" },
  { value: "FIRST_ORDER", label: "İlk Sipariş" },
  { value: "NEWSLETTER", label: "Bülten" },
  { value: "PROFILE_COMPLETE", label: "Profil" },
]

const TYPE_BADGES: Record<string, { bg: string; label: string }> = {
  PURCHASE: { bg: "bg-blue-100 text-blue-700", label: "Satın Alma" },
  BIRTHDAY: { bg: "bg-pink-100 text-pink-700", label: "Doğum Günü" },
  REVIEW: { bg: "bg-amber-100 text-amber-700", label: "Yorum" },
  PHOTO_REVIEW: { bg: "bg-orange-100 text-orange-700", label: "Fotoğraflı Yorum" },
  REFERRAL: { bg: "bg-indigo-100 text-indigo-700", label: "Referral" },
  REDEMPTION: { bg: "bg-red-100 text-red-700", label: "Kullanım" },
  MANUAL: { bg: "bg-purple-100 text-purple-700", label: "Manuel" },
  EXPIRED: { bg: "bg-gray-100 text-gray-600", label: "Süresi Dolmuş" },
  FIRST_ORDER: { bg: "bg-green-100 text-green-700", label: "İlk Sipariş" },
  NEWSLETTER: { bg: "bg-teal-100 text-teal-700", label: "Bülten" },
  PROFILE_COMPLETE: { bg: "bg-cyan-100 text-cyan-700", label: "Profil" },
}

/* ---------- Main Page ---------- */

export default function SadakatIslemlerPage() {
  /* List state */
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    search: "",
    type: "",
    dateFrom: "",
    dateTo: "",
  })

  /* Manual form state */
  const [manualSearch, setManualSearch] = useState("")
  const [manualMode, setManualMode] = useState<"add" | "subtract">("add")
  const [manualAmount, setManualAmount] = useState("")
  const [manualReason, setManualReason] = useState("")
  const [manualSaving, setManualSaving] = useState(false)

  /* ---------- Fetch ---------- */

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      if (filters.search) params.set("search", filters.search)
      if (filters.type) params.set("type", filters.type)
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
      if (filters.dateTo) params.set("dateTo", filters.dateTo)

      const res = await fetch(`/api/admin/loyalty/transactions?${params}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setTransactions(data.transactions ?? [])
      setTotalPages(data.totalPages ?? 1)
    } catch {
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  /* ---------- Handlers ---------- */

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  async function handleManualSubmit() {
    if (!manualSearch.trim() || !manualAmount || !manualReason.trim()) return
    setManualSaving(true)
    try {
      const points = manualMode === "add"
        ? Math.abs(Number(manualAmount))
        : -Math.abs(Number(manualAmount))

      const res = await fetch("/api/admin/loyalty/transactions/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSearch: manualSearch.trim(),
          points,
          reason: manualReason.trim(),
        }),
      })

      if (res.ok) {
        alert("İşlem başarıyla uygulandı")
        setManualSearch("")
        setManualAmount("")
        setManualReason("")
        setManualMode("add")
        await fetchTransactions()
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.error || "İşlem hatası")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setManualSaving(false)
    }
  }

  function formatDate(d: string | null) {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Puan İşlemleri" breadcrumb={["Sadakat", "İşlemler"]} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ========== LEFT: Transaction List (2 cols) ========== */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Kullanıcı adı veya e-posta..."
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
              />
            </div>
            <select
              value={filters.type}
              onChange={(e) => updateFilter("type", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter("dateFrom", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter("dateTo", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="bg-white border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Tarih</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Kullanıcı</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Tip</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Puan</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Açıklama</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Son Kullanma</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div
                            className="h-4 bg-gray-100 rounded animate-pulse"
                            style={{ width: `${50 + Math.random() * 50}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-white border rounded-xl p-12 text-center">
              <Inbox size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">İşlem bulunamadı</p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Tarih</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Kullanıcı</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Tip</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Puan</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Açıklama</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Son Kullanma</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {transactions.map((tx) => {
                      const badge = TYPE_BADGES[tx.type] || {
                        bg: "bg-gray-100 text-gray-600",
                        label: tx.type,
                      }
                      const isPositive = tx.points > 0
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(tx.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <span className="font-medium text-gray-900 text-xs">
                                {tx.userName || "Bilinmiyor"}
                              </span>
                              <p className="text-[11px] text-gray-400">{tx.userEmail}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${badge.bg}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`font-bold text-sm ${
                                isPositive ? "text-green-600" : "text-red-500"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {tx.points}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">
                            {tx.description || "—"}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                            {tx.expiresAt ? formatDate(tx.expiresAt) : "—"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-xs text-gray-500">
                    Sayfa {page} / {totalPages}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========== RIGHT: Manual Points Form (1 col, sticky) ========== */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <div className="bg-white border rounded-xl p-6 space-y-5">
              <div className="flex items-center gap-2">
                <UserPlus size={18} className="text-[#B8975C]" />
                <h3 className="text-base font-semibold text-[#3D1A0A]">Manuel Puan İşlemi</h3>
              </div>

              {/* User search */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Kullanıcı (e-posta veya isim)
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={manualSearch}
                    onChange={(e) => setManualSearch(e.target.value)}
                    placeholder="ornek@email.com"
                    className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>
              </div>

              {/* Add / Subtract */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">İşlem Tipi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setManualMode("add")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                      manualMode === "add"
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <ArrowUpCircle size={16} />
                    Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualMode("subtract")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                      manualMode === "subtract"
                        ? "bg-red-50 border-red-300 text-red-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <ArrowDownCircle size={16} />
                    Çıkar
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Puan Miktarı</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  placeholder="100"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Sebep <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={manualReason}
                  onChange={(e) => setManualReason(e.target.value)}
                  rows={3}
                  placeholder="Manuel puan ekleme/çıkarma sebebi..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              {/* Preview */}
              {manualSearch && manualAmount && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm ${
                    manualMode === "add"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  <strong>{manualSearch}</strong> kullanıcısına{" "}
                  <strong>
                    {manualMode === "add" ? "+" : "-"}
                    {manualAmount}
                  </strong>{" "}
                  puan {manualMode === "add" ? "eklenecek" : "çıkarılacak"}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleManualSubmit}
                disabled={manualSaving || !manualSearch.trim() || !manualAmount || !manualReason.trim()}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  manualMode === "add"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {manualSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : manualMode === "add" ? (
                  <ArrowUpCircle size={16} />
                ) : (
                  <ArrowDownCircle size={16} />
                )}
                Uygula
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

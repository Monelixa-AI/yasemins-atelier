"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Search,
  Download,
  MoreHorizontal,
  FileText,
  Eye,
} from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"

/* ---------- types ---------- */

interface OrderItem {
  id: string
  productName: string
  variantName?: string
  quantity: number
  unitPrice: string
}

interface Order {
  id: string
  orderNumber: string
  guestEmail: string
  status: string
  paymentStatus: string
  total: string
  deliveryDate: string | null
  createdAt: string
  items: OrderItem[]
}

interface Filters {
  search: string
  status: string
  paymentStatus: string
  dateFrom: string
  dateTo: string
}

/* ---------- constants ---------- */

const ORDER_STATUSES = [
  { value: "", label: "Tüm Durumlar" },
  { value: "PENDING", label: "Bekliyor" },
  { value: "CONFIRMED", label: "Onaylandı" },
  { value: "PREPARING", label: "Hazırlanıyor" },
  { value: "READY", label: "Hazır" },
  { value: "OUT_FOR_DELIVERY", label: "Yolda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal" },
]

const PAYMENT_STATUSES = [
  { value: "", label: "Tüm Ödemeler" },
  { value: "PAID", label: "Ödendi" },
  { value: "PENDING", label: "Bekliyor" },
  { value: "FAILED", label: "Başarısız" },
]

/* ---------- component ---------- */

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    paymentStatus: "",
    dateFrom: "",
    dateTo: "",
  })

  /* fetch */
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      if (filters.search) params.set("search", filters.search)
      if (filters.status) params.set("status", filters.status)
      if (filters.paymentStatus) params.set("paymentStatus", filters.paymentStatus)
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
      if (filters.dateTo) params.set("dateTo", filters.dateTo)

      const res = await fetch(`/api/admin/orders?${params}`)
      const data = await res.json()
      setOrders(data.orders ?? [])
      setTotalPages(data.totalPages ?? 1)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  /* reset page on filter change */
  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  /* close dropdown on outside click */
  useEffect(() => {
    if (!openMenuId) return
    const handler = () => setOpenMenuId(null)
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [openMenuId])

  /* CSV placeholder */
  const handleCSVDownload = () => {
    alert("CSV indirme henüz aktif değil.")
  }

  /* ---------- columns ---------- */

  const columns: Column<Order>[] = [
    {
      key: "orderNumber",
      label: "Sipariş No",
      render: (row) => (
        <Link
          href={`/admin/siparisler/${row.id}`}
          className="font-mono text-sm text-[#C4622D] hover:underline"
        >
          {row.orderNumber}
        </Link>
      ),
    },
    {
      key: "guestEmail",
      label: "Müşteri",
      render: (row) => (
        <span className="text-gray-700 truncate max-w-[180px] block">
          {row.guestEmail}
        </span>
      ),
    },
    {
      key: "items",
      label: "Ürünler",
      render: (row) => {
        if (!row.items || row.items.length === 0) return <span className="text-gray-400">—</span>
        const first = row.items[0]
        const rest = row.items.length - 1
        return (
          <span className="text-gray-700 text-xs">
            {first.productName}
            {rest > 0 && (
              <span className="text-gray-400 ml-1">+{rest} ürün</span>
            )}
          </span>
        )
      },
    },
    {
      key: "deliveryDate",
      label: "Teslimat",
      render: (row) =>
        row.deliveryDate ? (
          <span className="text-gray-600 text-xs">
            {new Date(row.deliveryDate).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: "total",
      label: "Tutar",
      className: "text-right",
      render: (row) => (
        <span className="font-medium text-gray-900">
          {parseFloat(row.total).toLocaleString("tr-TR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
          ₺
        </span>
      ),
    },
    {
      key: "paymentStatus",
      label: "Ödeme",
      render: (row) => <StatusBadge status={row.paymentStatus} type="payment" />,
    },
    {
      key: "status",
      label: "Durum",
      render: (row) => <StatusBadge status={row.status} type="order" />,
    },
    {
      key: "actions",
      label: "İşlemler",
      className: "w-[80px]",
      render: (row) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOpenMenuId(openMenuId === row.id ? null : row.id)
            }}
            className="p-1.5 rounded hover:bg-gray-100"
          >
            <MoreHorizontal size={16} className="text-gray-500" />
          </button>

          {openMenuId === row.id && (
            <div className="absolute right-0 top-8 z-20 w-44 bg-white border rounded-lg shadow-lg py-1">
              <Link
                href={`/admin/siparisler/${row.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Eye size={14} />
                Detay
              </Link>
              <button
                onClick={() => {
                  window.open(`/api/invoices/${row.id}`, "_blank")
                  setOpenMenuId(null)
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <FileText size={14} />
                Fatura İndir
              </button>
            </div>
          )}
        </div>
      ),
    },
  ]

  /* ---------- render ---------- */

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Siparişler"
        breadcrumb={["Admin", "Siparişler"]}
        actions={
          <button
            onClick={handleCSVDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#3D1A0A] text-[#E8D5A3] rounded-lg hover:bg-[#5A2D1A] transition-colors"
          >
            <Download size={16} />
            CSV İndir
          </button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Sipariş no veya e-posta ara..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={filters.paymentStatus}
          onChange={(e) => updateFilter("paymentStatus", e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => updateFilter("dateFrom", e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
          title="Başlangıç tarihi"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => updateFilter("dateTo", e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
          title="Bitiş tarihi"
        />
      </div>

      {/* Data Table */}
      <DataTable<Order>
        columns={columns}
        data={orders}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="Sipariş bulunamadı"
      />
    </div>
  )
}

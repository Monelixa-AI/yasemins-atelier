"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import {
  Users, Search, Download, UserPlus, Crown, Moon, Eye,
} from "lucide-react"

interface Customer {
  id: string
  name: string | null
  email: string
  phone: string | null
  loyaltyTier: string | null
  totalSpent: string | number
  orderCount: number
  createdAt: string
  _count?: { orders: number }
}

interface Filters {
  search: string
  segment: string
  minOrders: string
  maxOrders: string
}

export default function MusterilerPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState<Filters>({
    search: "",
    segment: "",
    minOrders: "",
    maxOrders: "",
  })

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      if (filters.search) params.set("search", filters.search)
      if (filters.segment) params.set("segment", filters.segment)
      if (filters.minOrders) params.set("minOrders", filters.minOrders)
      if (filters.maxOrders) params.set("maxOrders", filters.maxOrders)

      const res = await fetch(`/api/admin/customers?${params}`)
      const data = await res.json()
      setCustomers(data.customers ?? [])
      setTotalPages(data.totalPages ?? 1)
      setTotal(data.total ?? 0)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleCSV = () => {
    alert("CSV indirme henuz aktif degil.")
  }

  /* Metric cards - derived from total for now */
  const metricCards = [
    { label: "Toplam Musteri", value: total, icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Yeni Bu Ay", value: "—", icon: UserPlus, color: "text-green-600 bg-green-50" },
    { label: "VIP", value: "—", icon: Crown, color: "text-amber-600 bg-amber-50" },
    { label: "Uyuyan", value: "—", icon: Moon, color: "text-gray-600 bg-gray-50" },
  ]

  const columns: Column<Customer>[] = [
    {
      key: "name",
      label: "Ad",
      render: (row) => (
        <span className="font-medium text-gray-900">
          {row.name || "Isimsiz"}
        </span>
      ),
    },
    {
      key: "email",
      label: "E-posta",
      render: (row) => (
        <span className="text-gray-700 text-xs">{row.email}</span>
      ),
    },
    {
      key: "phone",
      label: "Telefon",
      render: (row) => (
        <span className="text-gray-600 text-xs">{row.phone || "—"}</span>
      ),
    },
    {
      key: "orderCount",
      label: "Siparis Sayisi",
      className: "text-center",
      render: (row) => (
        <span className="text-gray-700">
          {row._count?.orders ?? row.orderCount ?? 0}
        </span>
      ),
    },
    {
      key: "totalSpent",
      label: "Toplam Harcama",
      className: "text-right",
      render: (row) => (
        <span className="font-medium text-gray-900">
          {parseFloat(String(row.totalSpent || 0)).toLocaleString("tr-TR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
          &#8378;
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Son Siparis",
      render: (row) => (
        <span className="text-xs text-gray-500">
          {new Date(row.createdAt).toLocaleDateString("tr-TR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Islemler",
      className: "w-[80px]",
      render: (row) => (
        <Link
          href={`/admin/musteriler/${row.id}`}
          className="flex items-center gap-1 text-sm text-[#C4622D] hover:text-[#A34E1F]"
        >
          <Eye size={14} />
          Detay
        </Link>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Musteriler"
        breadcrumb={["CRM", "Musteriler"]}
        actions={
          <button
            onClick={handleCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#3D1A0A] text-[#E8D5A3] rounded-lg hover:bg-[#5A2D1A] transition-colors"
          >
            <Download size={16} />
            CSV Indir
          </button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => {
          const Icon = m.icon
          return (
            <div key={m.label} className="bg-white border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{m.label}</p>
                  <p className="text-lg font-bold text-gray-900">{m.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Ad, e-posta veya telefon ara..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
          />
        </div>

        <select
          value={filters.segment}
          onChange={(e) => updateFilter("segment", e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
        >
          <option value="">Tum Segmentler</option>
        </select>

        <input
          type="number"
          placeholder="Min siparis"
          value={filters.minOrders}
          onChange={(e) => updateFilter("minOrders", e.target.value)}
          className="w-28 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
        />

        <input
          type="number"
          placeholder="Max siparis"
          value={filters.maxOrders}
          onChange={(e) => updateFilter("maxOrders", e.target.value)}
          className="w-28 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
        />
      </div>

      {/* Data Table */}
      <DataTable<Customer>
        columns={columns}
        data={customers}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="Musteri bulunamadi"
      />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts"
import { Package, TrendingUp, Clock, CalendarDays, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"

const COLORS = ["#C4622D", "#B8975C", "#3D1A0A", "#6B3520", "#E8D5A3", "#8B3E18", "#4A7C3F", "#2563EB", "#7C3AED"]

interface DashboardData {
  todayOrders: number
  todayRevenue: number
  pendingOrders: number
  pendingBookings: number
  weekRevenue: number
  yesterdayOrders: number
  chartData: Array<{ date: string; orders: number; revenue: number }>
  categoryData: Array<{ name: string; value: number }>
  recentPending: Array<{ id: string; orderNumber: string; guestEmail: string; total: string; createdAt: string }>
  lowStock: Array<{ id: string; name: string; stockCount: number; lowStockAlert: number }>
  pendingReviews: Array<{ id: string; productName: string; rating: number; body: string; userName: string }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [chartRange, setChartRange] = useState<7 | 30 | 90>(30)

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch(`/api/admin/dashboard?range=${chartRange}`)
        if (res.ok) setData(await res.json())
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetchDashboard()
  }, [chartRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }

  const d = data || {
    todayOrders: 0, todayRevenue: 0, pendingOrders: 0, pendingBookings: 0,
    weekRevenue: 0, yesterdayOrders: 0, chartData: [], categoryData: [],
    recentPending: [], lowStock: [], pendingReviews: [],
  }

  return (
    <div>
      <AdminHeader title="Dashboard" />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={Package} label="Bugünkü Sipariş" value={d.todayOrders} sub={`Dün: ${d.yesterdayOrders}`} />
        <MetricCard icon={TrendingUp} label="Bugünkü Ciro" value={`${d.todayRevenue.toLocaleString("tr-TR")}₺`} sub={`Bu hafta: ${d.weekRevenue.toLocaleString("tr-TR")}₺`} />
        <MetricCard icon={Clock} label="Bekleyen Sipariş" value={d.pendingOrders} variant={d.pendingOrders > 5 ? "warning" : "default"} sub={<Link href="/admin/siparisler?status=PENDING" className="text-[#C4622D] hover:underline text-xs">Siparişlere Git →</Link>} />
        <MetricCard icon={CalendarDays} label="Bekleyen Rezervasyon" value={d.pendingBookings} sub={<Link href="/admin/rezervasyonlar?status=PENDING" className="text-[#C4622D] hover:underline text-xs">Rezlere Git →</Link>} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Sipariş & Ciro Trendi</h3>
            <div className="flex gap-1 text-xs">
              {([7, 30, 90] as const).map((r) => (
                <button key={r} onClick={() => setChartRange(r)}
                  className={`px-3 py-1 rounded ${chartRange === r ? "bg-[#C4622D] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {r} gün
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={d.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line yAxisId="left" dataKey="orders" stroke="#2563EB" strokeWidth={2} dot={false} name="Sipariş" />
              <Line yAxisId="right" dataKey="revenue" stroke="#C4622D" strokeWidth={2} dot={false} name="Ciro (₺)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-medium text-gray-900 mb-4">Kategori Dağılımı</h3>
          {d.categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={d.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name }) => name}>
                  {d.categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-12">Henüz veri yok</p>
          )}
        </div>
      </div>

      {/* Action Panels */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Orders */}
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-medium text-gray-900 mb-3">Bekleyen Siparişler</h3>
          {d.recentPending.length === 0 ? (
            <p className="text-sm text-gray-400">Bekleyen sipariş yok</p>
          ) : (
            <div className="space-y-3">
              {d.recentPending.slice(0, 5).map((o) => (
                <Link key={o.id} href={`/admin/siparisler/${o.id}`} className="block hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded">
                  <div className="flex justify-between text-sm">
                    <span className="font-mono text-xs">{o.orderNumber}</span>
                    <span className="font-medium">{parseFloat(o.total).toFixed(0)}₺</span>
                  </div>
                  <p className="text-xs text-gray-500">{o.guestEmail}</p>
                </Link>
              ))}
              <Link href="/admin/siparisler?status=PENDING" className="block text-xs text-[#C4622D] hover:underline pt-1">
                Tümünü Gör →
              </Link>
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-500" /> Stok Uyarıları
          </h3>
          {d.lowStock.length === 0 ? (
            <p className="text-sm text-gray-400">Stok uyarısı yok</p>
          ) : (
            <div className="space-y-2">
              {d.lowStock.map((p) => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{p.name}</span>
                  <span className="text-red-600 font-medium">{p.stockCount} adet</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Reviews */}
        <div className="bg-white border rounded-xl p-5">
          <h3 className="font-medium text-gray-900 mb-3">Bekleyen Yorumlar</h3>
          {d.pendingReviews.length === 0 ? (
            <p className="text-sm text-gray-400">Bekleyen yorum yok</p>
          ) : (
            <div className="space-y-3">
              {d.pendingReviews.slice(0, 3).map((r) => (
                <div key={r.id} className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
                    <span className="text-gray-500 text-xs">{r.userName}</span>
                  </div>
                  <p className="text-gray-600 text-xs truncate">{r.body}</p>
                </div>
              ))}
              <Link href="/admin/yorumlar" className="block text-xs text-[#C4622D] hover:underline pt-1">
                Tümünü Gör →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, sub, variant }: {
  icon: typeof Package; label: string; value: string | number
  sub?: React.ReactNode; variant?: "warning" | "default"
}) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-[#B8975C]" />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${variant === "warning" ? "text-red-600" : "text-[#C4622D]"}`}>
        {value}
      </p>
      {sub && <div className="mt-1 text-xs text-gray-500">{sub}</div>}
    </div>
  )
}

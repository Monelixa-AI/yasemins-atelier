"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"
import {
  Loader2, ArrowLeft, ShoppingBag, TrendingUp, Award, Star,
  StickyNote, Plus, Tag, Gift,
} from "lucide-react"

interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: string
  createdAt: string
  items: OrderItem[]
}

interface Booking {
  id: string
  serviceSlug: string
  status: string
  date: string
  total: string
  createdAt: string
}

interface CRMNote {
  id: string
  note: string
  createdBy: string
  createdAt: string
}

interface CustomerTag {
  id: string
  name: string
  color: string | null
}

interface CustomerSegment {
  id: string
  name: string
}

interface CustomerDetail {
  id: string
  name: string | null
  email: string
  phone: string | null
  loyaltyTier: string | null
  loyaltyPoints: number
  totalSpent: string | number
  orderCount: number
  isActive: boolean
  isCorporate: boolean
  companyName: string | null
  createdAt: string
  orders: Order[]
  bookings: Booking[]
  crmNotes: CRMNote[]
  tags: CustomerTag[]
  segments: CustomerSegment[]
}

export default function MusteriDetayPage() {
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [savingNote, setSavingNote] = useState(false)

  const fetchCustomer = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/customers/${customerId}`)
      if (!res.ok) throw new Error()
      setCustomer(await res.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [customerId])

  useEffect(() => {
    fetchCustomer()
  }, [fetchCustomer])

  async function handleAddNote() {
    if (!newNote.trim()) return
    setSavingNote(true)
    try {
      const res = await fetch("/api/admin/crm/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: customerId,
          note: newNote.trim(),
          createdBy: "admin",
        }),
      })

      if (res.ok) {
        setNewNote("")
        await fetchCustomer()
      }
    } catch {
      alert("Not eklenemedi")
    } finally {
      setSavingNote(false)
    }
  }

  function handleAddPoints() {
    alert("Puan ekleme yakinda aktif olacak.")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }

  if (!customer) {
    return (
      <div>
        <AdminHeader title="Musteri Bulunamadi" breadcrumb={["CRM", "Musteriler"]} />
        <div className="bg-white border rounded-xl p-12 text-center">
          <p className="text-sm text-gray-400">Musteri bulunamadi.</p>
          <Link href="/admin/musteriler" className="text-sm text-[#C4622D] hover:underline mt-2 inline-block">
            Geri Don
          </Link>
        </div>
      </div>
    )
  }

  const totalSpent = parseFloat(String(customer.totalSpent || 0))
  const avgOrder = customer.orderCount > 0 ? totalSpent / customer.orderCount : 0

  const metricCards = [
    { label: "Toplam Siparis", value: customer.orderCount, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    {
      label: "Toplam Harcama",
      value: totalSpent.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "\u20BA",
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Ort. Siparis",
      value: avgOrder.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + "\u20BA",
      icon: Star,
      color: "text-amber-600 bg-amber-50",
    },
    { label: "Sadakat Puani", value: customer.loyaltyPoints ?? 0, icon: Award, color: "text-purple-600 bg-purple-50" },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Musteri Detay"
        breadcrumb={["CRM", "Musteriler", customer.name || customer.email]}
        actions={
          <Link
            href="/admin/musteriler"
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={16} />
            Geri Don
          </Link>
        }
      />

      {/* Profile Header */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-[#C4622D]/10 flex items-center justify-center text-xl font-bold text-[#C4622D]">
            {(customer.name || customer.email).charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">
              {customer.name || "Isimsiz"}
            </h2>
            <p className="text-sm text-gray-500">{customer.email}</p>
            {customer.phone && (
              <p className="text-sm text-gray-500">{customer.phone}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Uye: {new Date(customer.createdAt).toLocaleDateString("tr-TR")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {customer.segments.map((seg) => (
              <span
                key={seg.id}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium"
              >
                {seg.name}
              </span>
            ))}
            {customer.loyaltyTier && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {customer.loyaltyTier}
              </span>
            )}
            {customer.isCorporate && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                Kurumsal
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* LEFT Column */}
        <div className="space-y-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Order History */}
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#B8975C]" />
                Siparis Gecmisi (Son 10)
              </h3>
            </div>
            <div className="divide-y">
              {customer.orders.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Henuz siparis yok
                </p>
              ) : (
                customer.orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/siparisler/${order.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-sm font-mono text-[#C4622D]">
                        {order.orderNumber}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        {parseFloat(order.total).toLocaleString("tr-TR")}&#8378;
                      </span>
                      <StatusBadge status={order.status} type="order" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Gift size={16} className="text-[#B8975C]" />
                Rezervasyon Gecmisi
              </h3>
            </div>
            <div className="divide-y">
              {customer.bookings.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Henuz rezervasyon yok
                </p>
              ) : (
                customer.bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.serviceSlug}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        {parseFloat(booking.total || "0").toLocaleString("tr-TR")}&#8378;
                      </span>
                      <StatusBadge status={booking.status} type="booking" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT Column (Sticky) */}
        <div className="space-y-6">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* CRM Notes */}
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <StickyNote size={16} className="text-[#B8975C]" />
                  CRM Notlari
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {/* Existing Notes */}
                {customer.crmNotes.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {customer.crmNotes.map((n) => (
                      <div
                        key={n.id}
                        className="bg-gray-50 rounded-lg p-3 text-sm"
                      >
                        <p className="text-gray-700">{n.note}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {n.createdBy} &middot;{" "}
                          {new Date(n.createdAt).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Note */}
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  placeholder="Yeni not ekle..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
                <button
                  onClick={handleAddNote}
                  disabled={savingNote || !newNote.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
                >
                  {savingNote ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  Not Ekle
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Tag size={16} className="text-[#B8975C]" />
                  Etiketler
                </h3>
              </div>
              <div className="p-4">
                {customer.tags.length === 0 ? (
                  <p className="text-xs text-gray-400">Henuz etiket yok</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-xs px-2 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: (tag.color || "#C4622D") + "20",
                          color: tag.color || "#C4622D",
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Hizli Islemler
              </h3>
              <button
                onClick={handleAddPoints}
                className="w-full flex items-center justify-center gap-2 border border-[#C4622D] text-[#C4622D] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C4622D]/5 transition-colors"
              >
                <Award size={14} />
                Puan Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

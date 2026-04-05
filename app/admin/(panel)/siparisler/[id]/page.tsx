"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Truck,
  Save,
  Loader2,
  Clock,
  Package,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  CreditCard,
  RefreshCw,
} from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"

/* ---------- types ---------- */

interface OrderItem {
  id: string
  productName: string
  variantName?: string
  quantity: number
  unitPrice: string
}

interface TimelineEntry {
  id: string
  status: string
  note?: string
  createdAt: string
  adminName?: string
}

interface OrderDetail {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  paymentMethod: string
  paymentProvider: string
  total: string
  guestEmail: string
  guestPhone: string | null
  deliveryAddress: string | null
  deliveryDate: string | null
  deliverySlot: string | null
  trackingNumber: string | null
  createdAt: string
  items: OrderItem[]
  timeline: TimelineEntry[]
  paymentId: string | null
}

/* ---------- constants ---------- */

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Bekliyor" },
  { value: "CONFIRMED", label: "Onaylandı" },
  { value: "PREPARING", label: "Hazırlanıyor" },
  { value: "READY", label: "Hazır" },
  { value: "OUT_FOR_DELIVERY", label: "Yolda" },
  { value: "DELIVERED", label: "Teslim Edildi" },
  { value: "CANCELLED", label: "İptal" },
]

const TIMELINE_DOT_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-400",
  CONFIRMED: "bg-blue-400",
  PREPARING: "bg-indigo-400",
  READY: "bg-teal-400",
  OUT_FOR_DELIVERY: "bg-cyan-400",
  DELIVERED: "bg-green-400",
  CANCELLED: "bg-red-400",
  REFUNDED: "bg-purple-400",
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CREDIT_CARD: "Kredi Kartı",
  BANK_TRANSFER: "Havale / EFT",
  CASH: "Nakit",
  POS_ON_DELIVERY: "Kapıda POS",
}

/* ---------- component ---------- */

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  /* status update */
  const [newStatus, setNewStatus] = useState("")
  const [adminNote, setAdminNote] = useState("")
  const [statusUpdating, setStatusUpdating] = useState(false)

  /* tracking */
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingSaving, setTrackingSaving] = useState(false)

  /* refund modal */
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundLoading, setRefundLoading] = useState(false)

  /* fetch order */
  const fetchOrder = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`)
      if (!res.ok) throw new Error("Fetch failed")
      const data = await res.json()
      setOrder(data)
      setNewStatus(data.status)
      setTrackingNumber(data.trackingNumber ?? "")
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  /* handlers */
  const handleStatusUpdate = async () => {
    if (!newStatus) return
    setStatusUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note: adminNote }),
      })
      if (res.ok) {
        setAdminNote("")
        fetchOrder()
      } else {
        const data = await res.json()
        alert(data.error || "Durum güncellenemedi")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleTrackingSave = async () => {
    setTrackingSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/tracking`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber }),
      })
      if (res.ok) {
        fetchOrder()
      } else {
        const data = await res.json()
        alert(data.error || "Kargo takip no kaydedilemedi")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setTrackingSaving(false)
    }
  }

  const handleRefund = async () => {
    if (!order?.paymentId) return
    setRefundLoading(true)
    try {
      const res = await fetch("/api/admin/refunds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: order.paymentId,
          amount: parseFloat(order.total),
          reason: `Sipariş iadesi - ${order.orderNumber}`,
          adminUserId: "admin",
        }),
      })
      if (res.ok) {
        setShowRefundModal(false)
        fetchOrder()
      } else {
        const data = await res.json()
        alert(data.error || "İade başlatılamadı")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setRefundLoading(false)
    }
  }

  /* ---------- loading / error ---------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <AdminHeader
          title="Sipariş Bulunamadı"
          breadcrumb={["Admin", "Siparişler"]}
        />
        <p className="text-sm text-gray-500">
          Bu sipariş mevcut değil veya silinmiş olabilir.
        </p>
        <Link
          href="/admin/siparisler"
          className="inline-flex items-center gap-2 text-sm text-[#C4622D] hover:underline"
        >
          <ArrowLeft size={14} />
          Siparişlere Dön
        </Link>
      </div>
    )
  }

  /* ---------- render ---------- */

  const sortedTimeline = [...(order.timeline || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-6">
      <AdminHeader
        title={`Sipariş ${order.orderNumber}`}
        breadcrumb={["Admin", "Siparişler", order.orderNumber]}
        actions={
          <Link
            href="/admin/siparisler"
            className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Geri
          </Link>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ========== LEFT COLUMN (65%) ========== */}
        <div className="lg:w-[65%] space-y-6">
          {/* Order Info Card */}
          <div className="bg-white border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package size={18} className="text-[#C4622D]" />
                Sipariş Bilgileri
              </h2>
              <StatusBadge status={order.status} type="order" size="md" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Sipariş No</span>
                <span className="font-mono font-medium">{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Oluşturulma Tarihi</span>
                <span>
                  {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Ödeme Durumu</span>
                <StatusBadge status={order.paymentStatus} type="payment" />
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white border rounded-xl p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <RefreshCw size={16} className="text-[#C4622D]" />
              Durum Güncelle
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Admin notu (opsiyonel)..."
              rows={2}
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
            />
            <button
              onClick={handleStatusUpdate}
              disabled={statusUpdating || newStatus === order.status}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-[#3D1A0A] text-[#E8D5A3] rounded-lg hover:bg-[#5A2D1A] transition-colors disabled:opacity-50"
            >
              {statusUpdating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Durumu Güncelle
            </button>
          </div>

          {/* Product List */}
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="text-sm font-semibold text-gray-900">
                Ürünler ({order.items.length})
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Ürün</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-600">Varyant</th>
                  <th className="text-center px-5 py-3 font-medium text-gray-600">Adet</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600">Birim Fiyat</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-600">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {item.productName}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {item.variantName || "—"}
                    </td>
                    <td className="px-5 py-3 text-center">{item.quantity}</td>
                    <td className="px-5 py-3 text-right text-gray-600">
                      {parseFloat(item.unitPrice).toLocaleString("tr-TR")}₺
                    </td>
                    <td className="px-5 py-3 text-right font-medium">
                      {(item.quantity * parseFloat(item.unitPrice)).toLocaleString("tr-TR")}₺
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t bg-gray-50">
                <tr>
                  <td colSpan={4} className="px-5 py-3 text-right font-semibold text-gray-700">
                    Genel Toplam
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-gray-900">
                    {parseFloat(order.total).toLocaleString("tr-TR", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })}
                    ₺
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Customer Info */}
          <div className="bg-white border rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">Müşteri Bilgileri</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} className="text-gray-400 shrink-0" />
                {order.guestEmail}
              </div>
              {order.guestPhone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={14} className="text-gray-400 shrink-0" />
                  {order.guestPhone}
                </div>
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white border rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Truck size={16} className="text-[#C4622D]" />
              Teslimat Bilgileri
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {order.deliveryAddress && (
                <div className="sm:col-span-2">
                  <span className="text-gray-500 block text-xs mb-1">Adres</span>
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                </div>
              )}
              {order.deliveryDate && (
                <div>
                  <span className="text-gray-500 block text-xs mb-1">Teslimat Tarihi</span>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CalendarDays size={14} className="text-gray-400 shrink-0" />
                    {new Date(order.deliveryDate).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              )}
              {order.deliverySlot && (
                <div>
                  <span className="text-gray-500 block text-xs mb-1">Saat Aralığı</span>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={14} className="text-gray-400 shrink-0" />
                    {order.deliverySlot}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white border rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <CreditCard size={16} className="text-[#C4622D]" />
              Ödeme Bilgileri
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block text-xs">Yöntem</span>
                <span className="text-gray-700">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Tutar</span>
                <span className="font-medium text-gray-900">
                  {parseFloat(order.total).toLocaleString("tr-TR")}₺
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs">Sağlayıcı</span>
                <span className="text-gray-700">{order.paymentProvider || "—"}</span>
              </div>
            </div>

            {/* Refund button */}
            {order.paymentStatus === "PAID" && (
              <div className="pt-2 border-t">
                <button
                  onClick={() => setShowRefundModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <RefreshCw size={14} />
                  İade Başlat
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========== RIGHT COLUMN (35%) — Sticky ========== */}
        <div className="lg:w-[35%]">
          <div className="lg:sticky lg:top-6 space-y-6">
            {/* Timeline */}
            <div className="bg-white border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={16} className="text-[#C4622D]" />
                Zaman Çizelgesi
              </h2>

              {sortedTimeline.length === 0 ? (
                <p className="text-xs text-gray-400">Henüz kayıt yok.</p>
              ) : (
                <div className="space-y-0">
                  {sortedTimeline.map((entry, i) => (
                    <div key={entry.id} className="flex gap-3">
                      {/* dot + line */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${
                            TIMELINE_DOT_COLORS[entry.status] || "bg-gray-300"
                          }`}
                        />
                        {i < sortedTimeline.length - 1 && (
                          <div className="w-px flex-1 bg-gray-200 my-1" />
                        )}
                      </div>
                      {/* content */}
                      <div className="pb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <StatusBadge status={entry.status} type="order" />
                          {entry.adminName && (
                            <span className="text-xs text-gray-400">
                              — {entry.adminName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(entry.createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {entry.note && (
                          <p className="text-xs text-gray-600 mt-1 bg-gray-50 px-2 py-1 rounded">
                            {entry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white border rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">Hızlı İşlemler</h2>

              {/* Invoice link */}
              <a
                href={`/api/invoices/${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <FileText size={16} className="text-[#C4622D]" />
                Fatura İndir
              </a>

              {/* Tracking Number */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">Kargo Takip No</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Takip numarasını girin..."
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                  />
                  <button
                    onClick={handleTrackingSave}
                    disabled={trackingSaving}
                    className="flex items-center gap-1 px-3 py-2 text-sm bg-[#3D1A0A] text-[#E8D5A3] rounded-lg hover:bg-[#5A2D1A] transition-colors disabled:opacity-50"
                  >
                    {trackingSaving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && (
        <ConfirmModal
          title="İade Başlat"
          message={`${order.orderNumber} numaralı sipariş için ${parseFloat(order.total).toLocaleString("tr-TR")}₺ tutarında tam iade başlatılacak. Devam etmek istiyor musunuz?`}
          confirmLabel="İadeyi Başlat"
          variant="danger"
          loading={refundLoading}
          onConfirm={handleRefund}
          onCancel={() => setShowRefundModal(false)}
        />
      )}
    </div>
  )
}

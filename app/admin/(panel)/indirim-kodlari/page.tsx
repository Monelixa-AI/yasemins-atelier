"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import {
  Plus, Trash2, Loader2, X, Save, Ticket, Copy,
  ToggleLeft, ToggleRight, Shuffle,
} from "lucide-react"

type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING"

interface DiscountCode {
  id: string
  code: string
  type: DiscountType
  value: string
  minOrderAmount: string | null
  maxUses: number | null
  usedCount: number
  perUserLimit: number | null
  isFirstOrderOnly: boolean
  isActive: boolean
  validFrom: string | null
  validUntil: string | null
  createdAt: string
}

interface DiscountForm {
  code: string
  type: DiscountType
  value: string
  minOrderAmount: string
  maxUses: string
  perUserLimit: string
  isFirstOrderOnly: boolean
  validFrom: string
  validUntil: string
}

const emptyForm: DiscountForm = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  minOrderAmount: "",
  maxUses: "",
  perUserLimit: "",
  isFirstOrderOnly: false,
  validFrom: "",
  validUntil: "",
}

const TYPE_LABELS: Record<DiscountType, string> = {
  PERCENTAGE: "Yuzde (%)",
  FIXED_AMOUNT: "Sabit Tutar (₺)",
  FREE_SHIPPING: "Ucretsiz Kargo",
}

const TYPE_BADGES: Record<DiscountType, string> = {
  PERCENTAGE: "bg-blue-100 text-blue-700",
  FIXED_AMOUNT: "bg-green-100 text-green-700",
  FREE_SHIPPING: "bg-purple-100 text-purple-700",
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export default function IndirimKodlariPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<DiscountForm>(emptyForm)

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<DiscountCode | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Toggle loading tracker
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Copied state
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchCodes = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/discount-codes")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCodes(data.discountCodes || data.codes || data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCodes()
  }, [fetchCodes])

  function openNew() {
    setForm(emptyForm)
    setModalOpen(true)
  }

  function handleCopy(code: string, id: string) {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  async function handleToggleActive(id: string, isActive: boolean) {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/admin/discount-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      if (res.ok) {
        setCodes((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive } : c))
        )
      }
    } catch {
      // ignore
    } finally {
      setTogglingId(null)
    }
  }

  async function handleSave() {
    if (!form.code.trim()) return
    if (form.type !== "FREE_SHIPPING" && !form.value) return
    setSaving(true)

    try {
      const body = {
        code: form.code.trim().toUpperCase(),
        type: form.type,
        value:
          form.type === "FREE_SHIPPING" ? 0 : parseFloat(form.value),
        minOrderAmount: form.minOrderAmount
          ? parseFloat(form.minOrderAmount)
          : null,
        maxUses: form.maxUses ? parseInt(form.maxUses) : null,
        perUserLimit: form.perUserLimit ? parseInt(form.perUserLimit) : null,
        isFirstOrderOnly: form.isFirstOrderOnly,
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null,
      }

      const res = await fetch("/api/admin/discount-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Kaydetme hatasi")
        return
      }

      setModalOpen(false)
      await fetchCodes()
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)

    try {
      const res = await fetch(`/api/admin/discount-codes/${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Silme hatasi")
        return
      }

      await fetchCodes()
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setDeleteLoading(false)
      setDeleteTarget(null)
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("tr-TR")
  }

  function formatValue(code: DiscountCode) {
    if (code.type === "PERCENTAGE") return `%${parseFloat(code.value)}`
    if (code.type === "FIXED_AMOUNT")
      return `${parseFloat(code.value).toLocaleString("tr-TR")}₺`
    return "Ucretsiz Kargo"
  }

  return (
    <div>
      <AdminHeader
        title="Indirim Kodlari"
        breadcrumb={["Katalog", "Indirim Kodlari"]}
        actions={
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] transition-colors"
          >
            <Plus size={16} />
            Yeni Kod
          </button>
        }
      />

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : codes.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Ticket size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Henuz indirim kodu olusturulmadi</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Kod
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Tip
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Deger
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Kullanim
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Aktif
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Gecerlilik
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Islem
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {codes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">
                          {code.code}
                        </span>
                        <button
                          onClick={() => handleCopy(code.code, code.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Kopyala"
                        >
                          <Copy size={14} />
                        </button>
                        {copiedId === code.id && (
                          <span className="text-[10px] text-green-600">
                            Kopyalandi!
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          TYPE_BADGES[code.type]
                        }`}
                      >
                        {TYPE_LABELS[code.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatValue(code)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      <span className="font-medium">{code.usedCount}</span>
                      {code.maxUses && (
                        <span className="text-gray-400">
                          /{code.maxUses}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          handleToggleActive(code.id, !code.isActive)
                        }
                        disabled={togglingId === code.id}
                      >
                        {code.isActive ? (
                          <ToggleRight size={28} className="text-[#C4622D]" />
                        ) : (
                          <ToggleLeft size={28} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {formatDate(code.validFrom)} - {formatDate(code.validUntil)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(code)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                Yeni Indirim Kodu
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Code */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Indirim Kodu
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        code: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="orn. YAZ2024"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono uppercase focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, code: generateCode() }))
                    }
                    className="flex items-center gap-1.5 border rounded-lg px-3 py-2 text-sm hover:bg-gray-50 text-gray-600"
                    title="Otomatik kod olustur"
                  >
                    <Shuffle size={14} />
                    Otomatik Uret
                  </button>
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Indirim Tipi
                </label>
                <div className="flex gap-2">
                  {(
                    ["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"] as const
                  ).map((type) => (
                    <label
                      key={type}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 border rounded-lg text-sm cursor-pointer transition-colors ${
                        form.type === type
                          ? "border-[#C4622D] bg-[#C4622D]/5 text-[#C4622D] font-medium"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="discountType"
                        value={type}
                        checked={form.type === type}
                        onChange={() =>
                          setForm((prev) => ({ ...prev, type, value: "" }))
                        }
                        className="sr-only"
                      />
                      {TYPE_LABELS[type]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Value */}
              {form.type !== "FREE_SHIPPING" && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Indirim Degeri
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={form.type === "PERCENTAGE" ? "1" : "0.01"}
                      min="0"
                      max={form.type === "PERCENTAGE" ? "100" : undefined}
                      value={form.value}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      placeholder="0"
                      className="w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                      {form.type === "PERCENTAGE" ? "%" : "₺"}
                    </span>
                  </div>
                </div>
              )}

              {/* Min Order Amount */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Minimum Siparis Tutari (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.minOrderAmount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minOrderAmount: e.target.value,
                    }))
                  }
                  placeholder="Opsiyonel"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              {/* Max Uses + Per User */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Toplam Kullanim Limiti
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.maxUses}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        maxUses: e.target.value,
                      }))
                    }
                    placeholder="Limitsiz"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Kisi Basi Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.perUserLimit}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        perUserLimit: e.target.value,
                      }))
                    }
                    placeholder="Limitsiz"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>
              </div>

              {/* First Order Only */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Sadece Ilk Siparis
                  </p>
                  <p className="text-xs text-gray-400">
                    Yalnizca ilk siparisinde gecerli olur
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      isFirstOrderOnly: !prev.isFirstOrderOnly,
                    }))
                  }
                >
                  {form.isFirstOrderOnly ? (
                    <ToggleRight size={32} className="text-[#C4622D]" />
                  ) : (
                    <ToggleLeft size={32} className="text-gray-400" />
                  )}
                </button>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Gecerlilik Baslangici
                  </label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        validFrom: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Gecerlilik Bitisi
                  </label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        validUntil: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Iptal
              </button>
              <button
                onClick={handleSave}
                disabled={
                  saving ||
                  !form.code.trim() ||
                  (form.type !== "FREE_SHIPPING" && !form.value)
                }
                className="flex items-center gap-2 bg-[#C4622D] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Indirim Kodunu Sil"
          message={`"${deleteTarget.code}" kodu kalici olarak silinecek. Emin misiniz?`}
          confirmLabel="Sil"
          variant="danger"
          loading={deleteLoading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}

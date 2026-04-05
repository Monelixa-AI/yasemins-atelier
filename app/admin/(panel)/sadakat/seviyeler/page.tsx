"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import {
  Loader2, Save, Crown, Plus, X, AlertTriangle, RefreshCw,
} from "lucide-react"

/* ---------- Types ---------- */

interface TierConfig {
  name: string
  color: string
  icon: string
  minPoints: number
  benefits: string[]
  freeShippingThreshold: number
  multiplier: number
  customerCount: number
}

/* ---------- Main Page ---------- */

export default function SeviyelerPage() {
  const [tiers, setTiers] = useState<TierConfig[]>([
    {
      name: "Bronz",
      color: "#CD7F32",
      icon: "bronze",
      minPoints: 0,
      benefits: ["Temel puan kazanımı"],
      freeShippingThreshold: 500,
      multiplier: 1.0,
      customerCount: 0,
    },
    {
      name: "Gümüş",
      color: "#C0C0C0",
      icon: "silver",
      minPoints: 500,
      benefits: ["1.25x puan çarpanı", "Öncelikli destek"],
      freeShippingThreshold: 300,
      multiplier: 1.25,
      customerCount: 0,
    },
    {
      name: "Altın",
      color: "#B8975C",
      icon: "gold",
      minPoints: 2000,
      benefits: ["1.5x puan çarpanı", "Ücretsiz kargo", "Özel indirimler", "Erken erişim"],
      freeShippingThreshold: 0,
      multiplier: 1.5,
      customerCount: 0,
    },
  ])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [recalculating, setRecalculating] = useState(false)
  const [showRecalcConfirm, setShowRecalcConfirm] = useState(false)
  const [newBenefit, setNewBenefit] = useState<Record<number, string>>({})

  const fetchData = useCallback(async () => {
    try {
      const [configRes, reportRes] = await Promise.all([
        fetch("/api/admin/loyalty/config"),
        fetch("/api/admin/loyalty/reports?type=tier-counts").catch(() => null),
      ])

      if (configRes.ok) {
        const data = await configRes.json()
        if (data.tiers && Array.isArray(data.tiers) && data.tiers.length === 3) {
          setTiers(data.tiers)
        }
      }

      if (reportRes && reportRes.ok) {
        const counts = await reportRes.json()
        if (counts && typeof counts === "object") {
          setTiers((prev) =>
            prev.map((t) => ({
              ...t,
              customerCount: counts[t.icon] ?? counts[t.name.toLowerCase()] ?? t.customerCount,
            }))
          )
        }
      }
    } catch {
      // use defaults
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/loyalty/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tiers }),
      })
      if (res.ok) {
        alert("Seviye ayarları kaydedildi")
      } else {
        alert("Kaydetme hatası")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setSaving(false)
    }
  }

  async function handleRecalculate() {
    setRecalculating(true)
    setShowRecalcConfirm(false)
    try {
      const res = await fetch("/api/admin/loyalty/recalculate-tiers", {
        method: "POST",
      })
      if (res.ok) {
        alert("Seviyeler yeniden hesaplandı")
        await fetchData()
      } else {
        alert("Hesaplama hatası")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setRecalculating(false)
    }
  }

  function updateTier(index: number, field: keyof TierConfig, value: unknown) {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)))
  }

  function addBenefit(index: number) {
    const text = (newBenefit[index] || "").trim()
    if (!text) return
    setTiers((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, benefits: [...t.benefits, text] } : t
      )
    )
    setNewBenefit((prev) => ({ ...prev, [index]: "" }))
  }

  function removeBenefit(tierIndex: number, benefitIndex: number) {
    setTiers((prev) =>
      prev.map((t, i) =>
        i === tierIndex
          ? { ...t, benefits: t.benefits.filter((_, bi) => bi !== benefitIndex) }
          : t
      )
    )
  }

  if (loading) {
    return (
      <div>
        <AdminHeader title="Seviye Yönetimi" breadcrumb={["Sadakat", "Seviyeler"]} />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Seviye Yönetimi" breadcrumb={["Sadakat", "Seviyeler"]} />

      {/* Tier cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <div
            key={tier.icon}
            className="bg-white border-2 rounded-xl overflow-hidden"
            style={{ borderColor: tier.color + "40" }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ backgroundColor: tier.color + "15" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: tier.color + "30" }}
                >
                  <Crown size={20} style={{ color: tier.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: tier.color === "#C0C0C0" ? "#6B7280" : tier.color }}>
                    {tier.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {tier.customerCount} müşteri
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Çarpan</p>
                <p className="text-lg font-bold" style={{ color: tier.color === "#C0C0C0" ? "#6B7280" : tier.color }}>
                  {tier.multiplier}x
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Min points */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Minimum Puan
                </label>
                {index === 0 ? (
                  <div className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400">
                    0 (sabit)
                  </div>
                ) : (
                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={tier.minPoints}
                    onChange={(e) =>
                      updateTier(index, "minPoints", Math.max(1, Number(e.target.value)))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                )}
              </div>

              {/* Free shipping threshold */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Ücretsiz Kargo Eşiği (&#8378;)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={tier.freeShippingThreshold}
                  onChange={(e) =>
                    updateTier(index, "freeShippingThreshold", Math.max(0, Number(e.target.value)))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {tier.freeShippingThreshold === 0 ? "Her zaman ücretsiz kargo" : `${tier.freeShippingThreshold}₺ üzeri ücretsiz kargo`}
                </p>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Avantajlar
                </label>
                <div className="space-y-1.5">
                  {tier.benefits.map((benefit, bi) => (
                    <div
                      key={bi}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-sm text-gray-700"
                    >
                      <span className="flex-1">{benefit}</span>
                      <button
                        onClick={() => removeBenefit(index, bi)}
                        className="text-gray-400 hover:text-red-500 shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newBenefit[index] || ""}
                    onChange={(e) =>
                      setNewBenefit((prev) => ({ ...prev, [index]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addBenefit(index)
                      }
                    }}
                    placeholder="Yeni avantaj ekle..."
                    className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                  <button
                    onClick={() => addBenefit(index)}
                    className="p-1.5 bg-[#C4622D] text-white rounded-lg hover:bg-[#A34E1F] transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#C4622D] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Kaydet
        </button>
      </div>

      {/* Danger zone */}
      <div className="border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={18} className="text-red-500" />
          <h3 className="text-sm font-semibold text-red-700">Tehlikeli Bölge</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Tüm müşterilerin seviyelerini mevcut puan durumlarına göre yeniden hesaplar.
          Bu işlem geri alınamaz.
        </p>
        <button
          onClick={() => setShowRecalcConfirm(true)}
          disabled={recalculating}
          className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {recalculating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Tüm Seviyeleri Yeniden Hesapla
        </button>
      </div>

      {/* Recalculate confirm modal */}
      {showRecalcConfirm && (
        <ConfirmModal
          title="Seviyeleri Yeniden Hesapla"
          message="Tüm müşterilerin seviyeleri mevcut puan durumlarına göre yeniden atanacak. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?"
          confirmLabel="Yeniden Hesapla"
          variant="danger"
          loading={recalculating}
          onConfirm={handleRecalculate}
          onCancel={() => setShowRecalcConfirm(false)}
        />
      )}
    </div>
  )
}

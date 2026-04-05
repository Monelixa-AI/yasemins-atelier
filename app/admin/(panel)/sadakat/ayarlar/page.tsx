"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  Loader2, Save, Gift, Coins, ShoppingCart, Clock, Star,
  ToggleLeft, ToggleRight,
} from "lucide-react"

/* ---------- Types ---------- */

interface BonusEvent {
  key: string
  label: string
  enabled: boolean
  points: number
}

interface LoyaltyConfig {
  isActive: boolean
  programName: string
  programDescription: string
  showPointsOnSite: boolean
  showTiersOnSite: boolean
  spendPerPoints: number
  pointsPerSpend: number
  silverMultiplier: number
  goldMultiplier: number
  pointsToTLRate: number
  minPointsToRedeem: number
  maxRedeemPercent: number
  pointsExpireEnabled: boolean
  pointsExpireDays: number
  bonusEvents: BonusEvent[]
}

const DEFAULT_BONUS_EVENTS: BonusEvent[] = [
  { key: "FIRST_ORDER", label: "İlk Sipariş", enabled: true, points: 50 },
  { key: "REVIEW", label: "Yorum", enabled: true, points: 10 },
  { key: "PHOTO_REVIEW", label: "Fotoğraflı Yorum", enabled: true, points: 20 },
  { key: "REFERRAL", label: "Referral", enabled: true, points: 50 },
  { key: "BIRTHDAY", label: "Doğum Günü", enabled: true, points: 100 },
  { key: "NEWSLETTER", label: "Bülten", enabled: true, points: 5 },
  { key: "PROFILE_COMPLETE", label: "Profil Tamamlama", enabled: true, points: 15 },
]

const DEFAULT_CONFIG: LoyaltyConfig = {
  isActive: false,
  programName: "Yasemin Puan",
  programDescription: "",
  showPointsOnSite: true,
  showTiersOnSite: true,
  spendPerPoints: 10,
  pointsPerSpend: 1,
  silverMultiplier: 1.25,
  goldMultiplier: 1.5,
  pointsToTLRate: 0.1,
  minPointsToRedeem: 100,
  maxRedeemPercent: 50,
  pointsExpireEnabled: true,
  pointsExpireDays: 365,
  bonusEvents: DEFAULT_BONUS_EVENTS,
}

/* ---------- Toggle component ---------- */

function Toggle({
  checked,
  onChange,
  size = "md",
}: {
  checked: boolean
  onChange: (v: boolean) => void
  size?: "sm" | "md" | "lg"
}) {
  const sizes = {
    sm: { track: "w-8 h-[18px]", dot: "w-3.5 h-3.5", translate: "translate-x-[14px]" },
    md: { track: "w-10 h-[22px]", dot: "w-4 h-4", translate: "translate-x-[18px]" },
    lg: { track: "w-12 h-[26px]", dot: "w-5 h-5", translate: "translate-x-[22px]" },
  }
  const s = sizes[size]

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`${s.track} rounded-full relative transition-colors ${
        checked ? "bg-[#C4622D]" : "bg-gray-300"
      }`}
    >
      <span
        className={`${s.dot} rounded-full bg-white absolute top-1/2 -translate-y-1/2 left-[3px] transition-transform ${
          checked ? s.translate : "translate-x-0"
        }`}
      />
    </button>
  )
}

/* ---------- Main Page ---------- */

export default function SadakatAyarlarPage() {
  const [config, setConfig] = useState<LoyaltyConfig>(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/loyalty/config")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setConfig({
        ...DEFAULT_CONFIG,
        ...data,
        bonusEvents: data.bonusEvents?.length
          ? data.bonusEvents
          : DEFAULT_BONUS_EVENTS,
      })
    } catch {
      // use defaults
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/loyalty/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (res.ok) {
        alert("Ayarlar kaydedildi")
      } else {
        alert("Kaydetme hatası")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setSaving(false)
    }
  }

  function updateBonus(key: string, field: "enabled" | "points", value: boolean | number) {
    setConfig((prev) => ({
      ...prev,
      bonusEvents: prev.bonusEvents.map((e) =>
        e.key === key ? { ...e, [field]: value } : e
      ),
    }))
  }

  /* Live previews */
  const sampleOrder = 250
  const earnedPoints = Math.floor((sampleOrder / config.spendPerPoints) * config.pointsPerSpend)
  const redeemTL = (config.minPointsToRedeem * config.pointsToTLRate).toFixed(2)

  if (loading) {
    return (
      <div>
        <AdminHeader title="Sadakat Programı Ayarları" breadcrumb={["Sadakat", "Ayarlar"]} />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Sadakat Programı Ayarları"
        breadcrumb={["Sadakat", "Ayarlar"]}
        actions={
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${config.isActive ? "text-green-600" : "text-gray-400"}`}>
              {config.isActive ? "Program Aktif" : "Program Pasif"}
            </span>
            <Toggle
              checked={config.isActive}
              onChange={(v) => setConfig((p) => ({ ...p, isActive: v }))}
              size="lg"
            />
          </div>
        }
      />

      {/* 1. Program Kimliği */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Gift size={18} className="text-[#B8975C]" />
          <h2 className="text-base font-semibold text-[#3D1A0A]">Program Kimliği</h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Program Adı</label>
          <input
            type="text"
            value={config.programName}
            onChange={(e) => setConfig((p) => ({ ...p, programName: e.target.value }))}
            placeholder="Yasemin Puan"
            className="w-full max-w-md border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Program Açıklaması</label>
          <textarea
            value={config.programDescription}
            onChange={(e) => setConfig((p) => ({ ...p, programDescription: e.target.value }))}
            rows={3}
            placeholder="Alışveriş yaptıkça puan kazanın, puanlarınızı indirime dönüştürün..."
            className="w-full max-w-md border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Toggle
              checked={config.showPointsOnSite}
              onChange={(v) => setConfig((p) => ({ ...p, showPointsOnSite: v }))}
            />
            <span className="text-sm text-gray-700">Sitede puanları göster</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <Toggle
              checked={config.showTiersOnSite}
              onChange={(v) => setConfig((p) => ({ ...p, showTiersOnSite: v }))}
            />
            <span className="text-sm text-gray-700">Sitede seviyeleri göster</span>
          </label>
        </div>
      </div>

      {/* 2. Puan Kazanma */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Coins size={18} className="text-[#B8975C]" />
          <h2 className="text-base font-semibold text-[#3D1A0A]">Puan Kazanma</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Her kaç &#8378; harcamada
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={config.spendPerPoints}
              onChange={(e) =>
                setConfig((p) => ({ ...p, spendPerPoints: Math.max(1, Number(e.target.value)) }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Kaç puan kazanılır
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={config.pointsPerSpend}
              onChange={(e) =>
                setConfig((p) => ({ ...p, pointsPerSpend: Math.max(1, Number(e.target.value)) }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-[#FDF6EE] border border-[#E8D5A3]/40 rounded-lg px-4 py-3 max-w-lg">
          <p className="text-sm text-[#3D1A0A]">
            <span className="font-medium">{sampleOrder}&#8378;</span> sipariş{" "}
            <span className="mx-1 text-gray-400">&rarr;</span>{" "}
            <span className="font-bold text-[#C4622D]">{earnedPoints} puan</span>
          </p>
        </div>

        {/* Tier multipliers */}
        <div className="border-t pt-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Seviye Çarpanları
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Gümüş Çarpan
              </label>
              <input
                type="number"
                min={1}
                max={5}
                step={0.05}
                value={config.silverMultiplier}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, silverMultiplier: Number(e.target.value) }))
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Altın Çarpan
              </label>
              <input
                type="number"
                min={1}
                max={5}
                step={0.05}
                value={config.goldMultiplier}
                onChange={(e) =>
                  setConfig((p) => ({ ...p, goldMultiplier: Number(e.target.value) }))
                }
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Puan Kullanma */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingCart size={18} className="text-[#B8975C]" />
          <h2 className="text-base font-semibold text-[#3D1A0A]">Puan Kullanma</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              1 puan = kaç &#8378;
            </label>
            <input
              type="number"
              min={0.01}
              step={0.01}
              value={config.pointsToTLRate}
              onChange={(e) =>
                setConfig((p) => ({ ...p, pointsToTLRate: Number(e.target.value) }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Min. kullanım puanı
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={config.minPointsToRedeem}
              onChange={(e) =>
                setConfig((p) => ({ ...p, minPointsToRedeem: Math.max(1, Number(e.target.value)) }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Maks. indirim oranı (%)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              step={1}
              value={config.maxRedeemPercent}
              onChange={(e) =>
                setConfig((p) => ({
                  ...p,
                  maxRedeemPercent: Math.min(100, Math.max(1, Number(e.target.value))),
                }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="bg-[#FDF6EE] border border-[#E8D5A3]/40 rounded-lg px-4 py-3 max-w-2xl">
          <p className="text-sm text-[#3D1A0A]">
            Min. <span className="font-medium">{config.minPointsToRedeem} puan</span>{" "}
            <span className="mx-1 text-gray-400">&rarr;</span>{" "}
            <span className="font-bold text-[#C4622D]">{redeemTL}&#8378; indirim</span>
            {" "}(siparişin en fazla %{config.maxRedeemPercent}&apos;i)
          </p>
        </div>
      </div>

      {/* 4. Puan Sona Erme */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={18} className="text-[#B8975C]" />
          <h2 className="text-base font-semibold text-[#3D1A0A]">Puan Sona Erme</h2>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <Toggle
            checked={config.pointsExpireEnabled}
            onChange={(v) => setConfig((p) => ({ ...p, pointsExpireEnabled: v }))}
          />
          <span className="text-sm text-gray-700">Puanların süresi dolsun</span>
        </label>

        {config.pointsExpireEnabled && (
          <div className="max-w-xs">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Süre (gün)
            </label>
            <input
              type="number"
              min={1}
              step={1}
              value={config.pointsExpireDays}
              onChange={(e) =>
                setConfig((p) => ({ ...p, pointsExpireDays: Math.max(1, Number(e.target.value)) }))
              }
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Puanlar kazanıldıktan {config.pointsExpireDays} gün sonra sona erer.
            </p>
          </div>
        )}
      </div>

      {/* 5. Bonus Olaylar */}
      <div className="bg-white border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Star size={18} className="text-[#B8975C]" />
          <h2 className="text-base font-semibold text-[#3D1A0A]">Bonus Olaylar</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {config.bonusEvents.map((event) => (
            <div
              key={event.key}
              className={`border rounded-xl p-4 transition-colors ${
                event.enabled ? "bg-white border-[#E8D5A3]/60" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-800">{event.label}</span>
                <Toggle
                  checked={event.enabled}
                  onChange={(v) => updateBonus(event.key, "enabled", v)}
                  size="sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Puan</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={event.points}
                  onChange={(e) =>
                    updateBonus(event.key, "points", Math.max(0, Number(e.target.value)))
                  }
                  disabled={!event.enabled}
                  className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky save button */}
      <div className="sticky bottom-0 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pt-4 pb-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#C4622D] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors shadow-lg"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Kaydet
        </button>
      </div>
    </div>
  )
}

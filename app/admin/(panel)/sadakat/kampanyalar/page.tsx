"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import {
  Loader2, Save, Plus, Trash2, Zap, Percent, Lock,
  Search, X,
} from "lucide-react"

/* ---------- Types ---------- */

interface Campaign {
  id: string
  name: string
  multiplier: number
  startAt: string
  endAt: string
  appliesTo: "all" | "products" | "naturel" | "occasions"
  minOrderAmount: number | null
  isActive: boolean
}

interface TierDiscount {
  id: string
  tier: "bronze" | "silver" | "gold"
  discountPercent: number
  isActive: boolean
}

interface PointBlock {
  id: string
  userId: string
  userName: string
  userEmail: string
  reason: string
  createdAt: string
}

interface CampaignForm {
  name: string
  multiplier: number
  startAt: string
  endAt: string
  appliesTo: "all" | "products" | "naturel" | "occasions"
  minOrderAmount: string
}

interface TierDiscountForm {
  tier: "bronze" | "silver" | "gold"
  discountPercent: string
}

/* ---------- Toggle ---------- */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-9 h-5 rounded-full relative transition-colors ${
        checked ? "bg-[#C4622D]" : "bg-gray-300"
      }`}
    >
      <span
        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-1/2 -translate-y-1/2 left-[3px] transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  )
}

/* ---------- Tier labels ---------- */

const TIER_LABELS: Record<string, string> = {
  bronze: "Bronz",
  silver: "Gümüş",
  gold: "Altın",
}

const TIER_COLORS: Record<string, string> = {
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-gray-100 text-gray-700",
  gold: "bg-yellow-100 text-yellow-800",
}

const APPLIES_LABELS: Record<string, string> = {
  all: "Tümü",
  products: "Ürünler",
  naturel: "Naturel",
  occasions: "Occasions",
}

/* ---------- Main Page ---------- */

export default function SadakatKampanyalarPage() {
  /* State */
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [tierDiscounts, setTierDiscounts] = useState<TierDiscount[]>([])
  const [blocks, setBlocks] = useState<PointBlock[]>([])
  const [loading, setLoading] = useState(true)

  /* Campaign form */
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [campaignForm, setCampaignForm] = useState<CampaignForm>({
    name: "",
    multiplier: 2.0,
    startAt: "",
    endAt: "",
    appliesTo: "all",
    minOrderAmount: "",
  })
  const [campaignSaving, setCampaignSaving] = useState(false)

  /* Tier discount form */
  const [showTDForm, setShowTDForm] = useState(false)
  const [tdForm, setTdForm] = useState<TierDiscountForm>({ tier: "silver", discountPercent: "5" })
  const [tdSaving, setTdSaving] = useState(false)

  /* Block form */
  const [blockSearch, setBlockSearch] = useState("")
  const [blockReason, setBlockReason] = useState("")
  const [blockSaving, setBlockSaving] = useState(false)

  /* Delete */
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  /* ---------- Fetch ---------- */

  const fetchAll = useCallback(async () => {
    try {
      const [cRes, tRes, bRes] = await Promise.all([
        fetch("/api/admin/loyalty/campaigns").catch(() => null),
        fetch("/api/admin/loyalty/tier-discounts").catch(() => null),
        fetch("/api/admin/loyalty/blocks").catch(() => null),
      ])

      if (cRes && cRes.ok) {
        const data = await cRes.json()
        setCampaigns(Array.isArray(data) ? data : [])
      }
      if (tRes && tRes.ok) {
        const data = await tRes.json()
        setTierDiscounts(Array.isArray(data) ? data : [])
      }
      if (bRes && bRes.ok) {
        const data = await bRes.json()
        setBlocks(Array.isArray(data) ? data : [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  /* ---------- Handlers ---------- */

  async function saveCampaign() {
    if (!campaignForm.name.trim() || !campaignForm.startAt || !campaignForm.endAt) return
    setCampaignSaving(true)
    try {
      const res = await fetch("/api/admin/loyalty/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...campaignForm,
          multiplier: Number(campaignForm.multiplier),
          minOrderAmount: campaignForm.minOrderAmount
            ? Number(campaignForm.minOrderAmount)
            : null,
        }),
      })
      if (res.ok) {
        setShowCampaignForm(false)
        setCampaignForm({ name: "", multiplier: 2.0, startAt: "", endAt: "", appliesTo: "all", minOrderAmount: "" })
        await fetchAll()
      } else {
        alert("Kaydetme hatası")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setCampaignSaving(false)
    }
  }

  async function toggleCampaign(id: string, isActive: boolean) {
    try {
      await fetch(`/api/admin/loyalty/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, isActive } : c)))
    } catch {
      alert("Güncelleme hatası")
    }
  }

  async function saveTierDiscount() {
    if (!tdForm.discountPercent) return
    setTdSaving(true)
    try {
      const res = await fetch("/api/admin/loyalty/tier-discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tdForm.tier,
          discountPercent: Number(tdForm.discountPercent),
        }),
      })
      if (res.ok) {
        setShowTDForm(false)
        setTdForm({ tier: "silver", discountPercent: "5" })
        await fetchAll()
      } else {
        alert("Kaydetme hatası")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setTdSaving(false)
    }
  }

  async function toggleTierDiscount(id: string, isActive: boolean) {
    try {
      await fetch(`/api/admin/loyalty/tier-discounts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      setTierDiscounts((prev) => prev.map((t) => (t.id === id ? { ...t, isActive } : t)))
    } catch {
      alert("Güncelleme hatası")
    }
  }

  async function blockUser() {
    if (!blockSearch.trim() || !blockReason.trim()) return
    setBlockSaving(true)
    try {
      const res = await fetch("/api/admin/loyalty/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSearch: blockSearch.trim(), reason: blockReason.trim() }),
      })
      if (res.ok) {
        setBlockSearch("")
        setBlockReason("")
        await fetchAll()
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.error || "İşlem hatası")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setBlockSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      let url = ""
      if (deleteTarget.type === "campaign") url = `/api/admin/loyalty/campaigns/${deleteTarget.id}`
      else if (deleteTarget.type === "tierDiscount") url = `/api/admin/loyalty/tier-discounts/${deleteTarget.id}`
      else if (deleteTarget.type === "block") url = `/api/admin/loyalty/blocks/${deleteTarget.id}`

      const res = await fetch(url, { method: "DELETE" })
      if (!res.ok) {
        alert("Silme hatası")
        return
      }
      await fetchAll()
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setDeleteLoading(false)
      setDeleteTarget(null)
    }
  }

  function formatDate(d: string | null) {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("tr-TR")
  }

  if (loading) {
    return (
      <div>
        <AdminHeader title="Puan Kampanyaları" breadcrumb={["Sadakat", "Kampanyalar"]} />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AdminHeader title="Puan Kampanyaları" breadcrumb={["Sadakat", "Kampanyalar"]} />

      {/* ========== SECTION 1: Campaigns ========== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-[#B8975C]" />
            <h2 className="text-base font-semibold text-[#3D1A0A]">Puan Kampanyaları</h2>
          </div>
          <button
            onClick={() => setShowCampaignForm(!showCampaignForm)}
            className="flex items-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] transition-colors"
          >
            <Plus size={16} />
            Yeni Kampanya
          </button>
        </div>

        {/* Inline form */}
        {showCampaignForm && (
          <div className="bg-white border rounded-xl p-6 mb-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Kampanya Adı
                </label>
                <input
                  type="text"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="2x Puan Haftası"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Çarpan ({campaignForm.multiplier}x)
                </label>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.1}
                  value={campaignForm.multiplier}
                  onChange={(e) =>
                    setCampaignForm((p) => ({ ...p, multiplier: Number(e.target.value) }))
                  }
                  className="w-full accent-[#C4622D]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1x</span>
                  <span>5x</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Başlangıç
                </label>
                <input
                  type="datetime-local"
                  value={campaignForm.startAt}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, startAt: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Bitiş
                </label>
                <input
                  type="datetime-local"
                  value={campaignForm.endAt}
                  onChange={(e) => setCampaignForm((p) => ({ ...p, endAt: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Min. Sipariş (&#8378;, opsiyonel)
                </label>
                <input
                  type="number"
                  min={0}
                  value={campaignForm.minOrderAmount}
                  onChange={(e) =>
                    setCampaignForm((p) => ({ ...p, minOrderAmount: e.target.value }))
                  }
                  placeholder="—"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Uygulanacak Kapsam
              </label>
              <div className="flex flex-wrap gap-3">
                {(["all", "products", "naturel", "occasions"] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="appliesTo"
                      checked={campaignForm.appliesTo === opt}
                      onChange={() => setCampaignForm((p) => ({ ...p, appliesTo: opt }))}
                      className="accent-[#C4622D]"
                    />
                    <span className="text-sm text-gray-700">{APPLIES_LABELS[opt]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCampaignForm(false)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={saveCampaign}
                disabled={campaignSaving || !campaignForm.name.trim() || !campaignForm.startAt || !campaignForm.endAt}
                className="flex items-center gap-2 bg-[#C4622D] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
              >
                {campaignSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Kaydet
              </button>
            </div>
          </div>
        )}

        {/* Campaign table */}
        {campaigns.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <Zap size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">Henüz puan kampanyası oluşturulmadı</p>
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Ad</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Çarpan</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Başlangıç</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Bitiş</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Kapsam</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Aktif</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {c.multiplier}x
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{formatDate(c.startAt)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{formatDate(c.endAt)}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{APPLIES_LABELS[c.appliesTo] || c.appliesTo}</td>
                      <td className="px-4 py-3 text-center">
                        <Toggle checked={c.isActive} onChange={(v) => toggleCampaign(c.id, v)} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setDeleteTarget({ type: "campaign", id: c.id, name: c.name })}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========== SECTION 2: Tier Discounts ========== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Percent size={18} className="text-[#B8975C]" />
            <h2 className="text-base font-semibold text-[#3D1A0A]">Seviye İndirimleri</h2>
          </div>
          <button
            onClick={() => setShowTDForm(!showTDForm)}
            className="flex items-center gap-2 border border-[#C4622D] text-[#C4622D] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C4622D]/5 transition-colors"
          >
            <Plus size={16} />
            Yeni İndirim
          </button>
        </div>

        {/* Inline form */}
        {showTDForm && (
          <div className="bg-white border rounded-xl p-6 mb-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Seviye</label>
                <select
                  value={tdForm.tier}
                  onChange={(e) => setTdForm((p) => ({ ...p, tier: e.target.value as TierDiscountForm["tier"] }))}
                  className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                >
                  <option value="bronze">Bronz</option>
                  <option value="silver">Gümüş</option>
                  <option value="gold">Altın</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">İndirim (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={tdForm.discountPercent}
                  onChange={(e) => setTdForm((p) => ({ ...p, discountPercent: e.target.value }))}
                  className="w-24 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTDForm(false)}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={saveTierDiscount}
                  disabled={tdSaving}
                  className="flex items-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
                >
                  {tdSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {tierDiscounts.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <Percent size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">Henüz seviye indirimi tanımlanmadı</p>
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Seviye</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">İndirim</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Aktif</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tierDiscounts.map((td) => (
                    <tr key={td.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${TIER_COLORS[td.tier] || ""}`}>
                          {TIER_LABELS[td.tier] || td.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">%{td.discountPercent}</td>
                      <td className="px-4 py-3 text-center">
                        <Toggle checked={td.isActive} onChange={(v) => toggleTierDiscount(td.id, v)} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            setDeleteTarget({
                              type: "tierDiscount",
                              id: td.id,
                              name: `${TIER_LABELS[td.tier]} %${td.discountPercent}`,
                            })
                          }
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========== SECTION 3: Point Blocks ========== */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className="text-[#B8975C]" />
          <h2 className="text-base font-semibold text-[#3D1A0A]">Puan Dondurma</h2>
        </div>

        {/* Block form */}
        <div className="bg-white border rounded-xl p-6 mb-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Kullanıcı (e-posta veya isim)
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={blockSearch}
                  onChange={(e) => setBlockSearch(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Sebep</label>
              <textarea
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={2}
                placeholder="Dondurma sebebini yazın..."
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={blockUser}
              disabled={blockSaving || !blockSearch.trim() || !blockReason.trim()}
              className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {blockSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              Puan Dondur
            </button>
          </div>
        </div>

        {/* Active blocks */}
        {blocks.length === 0 ? (
          <div className="bg-white border rounded-xl p-8 text-center">
            <Lock size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">Aktif puan dondurma işlemi yok</p>
          </div>
        ) : (
          <div className="bg-white border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Kullanıcı</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Sebep</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Tarih</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {blocks.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-gray-900">{b.userName}</span>
                          <p className="text-xs text-gray-500">{b.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-xs max-w-[200px] truncate">
                        {b.reason}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{formatDate(b.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() =>
                            setDeleteTarget({ type: "block", id: b.id, name: b.userName })
                          }
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          <X size={12} />
                          Kaldır
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Silme Onayı"
          message={`"${deleteTarget.name}" kalıcı olarak silinecek. Emin misiniz?`}
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

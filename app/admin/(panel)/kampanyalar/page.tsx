"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import {
  Megaphone, Plus, Loader2, Save, X, Trash2,
} from "lucide-react"

type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "ENDED"

interface Campaign {
  id: string
  name: string
  status: CampaignStatus
  startDate: string | null
  endDate: string | null
  description: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  createdAt: string
}

interface CampaignForm {
  name: string
  status: CampaignStatus
  startDate: string
  endDate: string
  description: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
}

const emptyForm: CampaignForm = {
  name: "",
  status: "DRAFT",
  startDate: "",
  endDate: "",
  description: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
}

const STATUS_BADGES: Record<CampaignStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  ENDED: "bg-red-100 text-red-700",
}

const STATUS_LABELS: Record<CampaignStatus, string> = {
  DRAFT: "Taslak",
  ACTIVE: "Aktif",
  PAUSED: "Duraklatildi",
  ENDED: "Bitti",
}

export default function KampanyalarPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<CampaignForm>(emptyForm)
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/campaigns")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCampaigns(Array.isArray(data) ? data : [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          status: form.status,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          description: form.description.trim() || null,
          utmSource: form.utmSource.trim() || null,
          utmMedium: form.utmMedium.trim() || null,
          utmCampaign: form.utmCampaign.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Kaydetme hatasi")
        return
      }

      setModalOpen(false)
      setForm(emptyForm)
      await fetchCampaigns()
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
      const res = await fetch(`/api/admin/campaigns/${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error || "Silme hatasi")
        return
      }

      await fetchCampaigns()
    } catch {
      alert("Baglanti hatasi")
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
        <AdminHeader title="Kampanyalar" breadcrumb={["Pazarlama", "Kampanyalar"]} />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Kampanyalar"
        breadcrumb={["Pazarlama", "Kampanyalar"]}
        actions={
          <button
            onClick={() => {
              setForm(emptyForm)
              setModalOpen(true)
            }}
            className="flex items-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] transition-colors"
          >
            <Plus size={16} />
            Yeni Kampanya
          </button>
        }
      />

      {campaigns.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Megaphone size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Henuz kampanya olusturulmadi</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ad</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Durum</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Baslangic</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Bitis</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Islemler</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-gray-900">{c.name}</span>
                        {c.description && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[240px]">
                            {c.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_BADGES[c.status]
                        }`}
                      >
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {formatDate(c.startDate)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {formatDate(c.endDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setDeleteTarget(c)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                        title="Sil"
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

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Yeni Kampanya</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Kampanya Adi
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="orn. Yaz Kampanyasi 2025"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Durum
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value as CampaignStatus }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                >
                  <option value="DRAFT">Taslak</option>
                  <option value="ACTIVE">Aktif</option>
                  <option value="PAUSED">Duraklatildi</option>
                  <option value="ENDED">Bitti</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Baslangic Tarihi
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Bitis Tarihi
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Aciklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Kampanya aciklamasi..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              {/* UTM Parameters */}
              <div className="border-t pt-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  UTM Parametreleri
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      utm_source
                    </label>
                    <input
                      type="text"
                      value={form.utmSource}
                      onChange={(e) => setForm((p) => ({ ...p, utmSource: e.target.value }))}
                      placeholder="orn. instagram"
                      className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      utm_medium
                    </label>
                    <input
                      type="text"
                      value={form.utmMedium}
                      onChange={(e) => setForm((p) => ({ ...p, utmMedium: e.target.value }))}
                      placeholder="orn. social"
                      className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      utm_campaign
                    </label>
                    <input
                      type="text"
                      value={form.utmCampaign}
                      onChange={(e) => setForm((p) => ({ ...p, utmCampaign: e.target.value }))}
                      placeholder="orn. yaz-2025"
                      className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                    />
                  </div>
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
                disabled={saving || !form.name.trim()}
                className="flex items-center gap-2 bg-[#C4622D] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Kampanyayi Sil"
          message={`"${deleteTarget.name}" kampanyasi kalici olarak silinecek. Emin misiniz?`}
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

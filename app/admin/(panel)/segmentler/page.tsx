"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import {
  Tags, Plus, Loader2, Save, X, RefreshCw, Trash2,
} from "lucide-react"

interface Segment {
  id: string
  name: string
  description: string | null
  rules: unknown
  userCount: number
  createdAt: string
  _count?: { users: number }
}

interface SegmentForm {
  name: string
  description: string
}

export default function SegmentlerPage() {
  const [segments, setSegments] = useState<Segment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<SegmentForm>({ name: "", description: "" })
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Segment | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchSegments = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/crm/segments")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSegments(Array.isArray(data) ? data : [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSegments()
  }, [fetchSegments])

  async function handleSave() {
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/crm/segments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          rules: {},
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Kaydetme hatasi")
        return
      }

      setModalOpen(false)
      setForm({ name: "", description: "" })
      await fetchSegments()
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setSaving(false)
    }
  }

  async function handleSync(id: string) {
    setSyncingId(id)
    try {
      const res = await fetch(`/api/admin/crm/segments/${id}/sync`, {
        method: "POST",
      })
      if (res.ok) {
        const data = await res.json()
        alert(data.message || `Senkronize: ${data.synced} musteri`)
      }
    } catch {
      alert("Senkronizasyon hatasi")
    } finally {
      setSyncingId(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/crm/segments/${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error || "Silme hatasi")
        return
      }

      await fetchSegments()
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setDeleteLoading(false)
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return (
      <div>
        <AdminHeader title="Segmentler" breadcrumb={["CRM", "Segmentler"]} />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Segmentler"
        breadcrumb={["CRM", "Segmentler"]}
        actions={
          <button
            onClick={() => {
              setForm({ name: "", description: "" })
              setModalOpen(true)
            }}
            className="flex items-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] transition-colors"
          >
            <Plus size={16} />
            Yeni Segment
          </button>
        }
      />

      {segments.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Tags size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Henuz segment olusturulmadi</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Ad</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Aciklama</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Musteri Sayisi</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Islemler</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {segments.map((seg) => (
                  <tr key={seg.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{seg.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-500 text-xs">
                        {seg.description || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-gray-700">
                        {seg._count?.users ?? seg.userCount ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSync(seg.id)}
                          disabled={syncingId === seg.id}
                          className="flex items-center gap-1 text-xs text-[#C4622D] hover:text-[#A34E1F] font-medium disabled:opacity-50"
                          title="Senkronize Et"
                        >
                          <RefreshCw
                            size={14}
                            className={syncingId === seg.id ? "animate-spin" : ""}
                          />
                          Sync
                        </button>
                        <button
                          onClick={() => setDeleteTarget(seg)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                          title="Sil"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
          <div className="bg-white rounded-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Yeni Segment</h3>
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
                  Segment Adi
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="orn. VIP Musteriler"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Aciklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Segment aciklamasi..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <p className="text-xs text-amber-700">
                  Kural motoru henuz gelistirme asamasinda. Segmentler su an manuel olarak yonetilebilir.
                </p>
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
          title="Segmenti Sil"
          message={`"${deleteTarget.name}" segmenti kalici olarak silinecek. Emin misiniz?`}
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

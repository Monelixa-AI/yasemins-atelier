"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  Target, Loader2, Save, ToggleLeft, ToggleRight, Pencil, X,
} from "lucide-react"

interface Occasion {
  id: string
  slug: string
  name: string
  description: string | null
  imageUrl: string | null
  colorTheme: string | null
  isActive: boolean
  _count?: { products: number }
}

interface OccasionForm {
  name: string
  description: string
  imageUrl: string
  colorTheme: string
  isActive: boolean
}

export default function OccasionsPage() {
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<OccasionForm>({
    name: "", description: "", imageUrl: "", colorTheme: "", isActive: true,
  })
  const [saving, setSaving] = useState(false)

  const fetchOccasions = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/occasions")
      if (!res.ok) {
        // Try alternate endpoint
        const res2 = await fetch("/api/occasions")
        if (res2.ok) {
          const data = await res2.json()
          setOccasions(Array.isArray(data) ? data : data.occasions || [])
          return
        }
        throw new Error()
      }
      const data = await res.json()
      setOccasions(Array.isArray(data) ? data : data.occasions || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOccasions()
  }, [fetchOccasions])

  function handleEdit(occ: Occasion) {
    setEditingId(occ.id)
    setForm({
      name: occ.name,
      description: occ.description || "",
      imageUrl: occ.imageUrl || "",
      colorTheme: occ.colorTheme || "",
      isActive: occ.isActive,
    })
  }

  function handleCancel() {
    setEditingId(null)
  }

  async function handleSave(id: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/occasions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim() || null,
          imageUrl: form.imageUrl.trim() || null,
          colorTheme: form.colorTheme.trim() || null,
          isActive: form.isActive,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Kaydetme hatasi")
        return
      }

      setEditingId(null)
      await fetchOccasions()
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(occ: Occasion) {
    try {
      const res = await fetch(`/api/admin/occasions/${occ.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !occ.isActive }),
      })

      if (res.ok) {
        setOccasions((prev) =>
          prev.map((o) => (o.id === occ.id ? { ...o, isActive: !o.isActive } : o))
        )
      }
    } catch {
      // ignore
    }
  }

  if (loading) {
    return (
      <div>
        <AdminHeader title="Occasions" breadcrumb={["Icerik", "Occasions"]} />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminHeader title="Occasions" breadcrumb={["Icerik", "Occasions"]} />

      {occasions.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Target size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Henuz occasion bulunamadi</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {occasions.map((occ) => (
            <div
              key={occ.id}
              className="bg-white border rounded-xl overflow-hidden"
            >
              {editingId === occ.id ? (
                /* ---------- Inline Edit Form ---------- */
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">Duzenle</h3>
                    <button
                      onClick={handleCancel}
                      className="p-1 rounded hover:bg-gray-100 text-gray-400"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ad</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Aciklama</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                      rows={3}
                      className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Gorsel URL</label>
                    <input
                      type="text"
                      value={form.imageUrl}
                      onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                      placeholder="https://..."
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Renk Temasi</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={form.colorTheme || "#C4622D"}
                        onChange={(e) => setForm((p) => ({ ...p, colorTheme: e.target.value }))}
                        className="w-10 h-10 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.colorTheme}
                        onChange={(e) => setForm((p) => ({ ...p, colorTheme: e.target.value }))}
                        placeholder="#C4622D"
                        className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <p className="text-sm font-medium text-gray-700">Aktif</p>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                    >
                      {form.isActive ? (
                        <ToggleRight size={28} className="text-[#C4622D]" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleSave(occ.id)}
                    disabled={saving || !form.name.trim()}
                    className="w-full flex items-center justify-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Kaydet
                  </button>
                </div>
              ) : (
                /* ---------- Card View ---------- */
                <>
                  <div
                    className="h-2"
                    style={{ backgroundColor: occ.colorTheme || "#C4622D" }}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{occ.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{occ.slug}</p>
                      </div>
                      <button
                        onClick={() => handleEdit(occ)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                        title="Duzenle"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>

                    {occ.description && (
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                        {occ.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {occ._count?.products ?? 0} urun
                      </span>
                      <button
                        onClick={() => handleToggleActive(occ)}
                        title={occ.isActive ? "Pasife al" : "Aktif et"}
                      >
                        {occ.isActive ? (
                          <ToggleRight size={28} className="text-[#C4622D]" />
                        ) : (
                          <ToggleLeft size={28} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

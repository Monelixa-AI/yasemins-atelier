"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import {
  Plus, Pencil, Trash2, Loader2, X, Search, Save, Gift,
  ToggleLeft, ToggleRight,
} from "lucide-react"

interface Product {
  id: string
  name: string
}

interface BundleItem {
  productId: string
  productName: string
  quantity: number
}

interface Bundle {
  id: string
  name: string
  slug: string
  description: string | null
  price: string
  isActive: boolean
  validFrom: string | null
  validUntil: string | null
  items: Array<{
    id: string
    quantity: number
    product: { id: string; name: string }
  }>
}

interface BundleForm {
  name: string
  slug: string
  description: string
  price: string
  validFrom: string
  validUntil: string
  items: BundleItem[]
}

const emptyForm: BundleForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  validFrom: "",
  validUntil: "",
  items: [],
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function PaketlerPage() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<BundleForm>(emptyForm)

  // Product search for items
  const [itemSearchIndex, setItemSearchIndex] = useState<number | null>(null)
  const [itemSearch, setItemSearch] = useState("")
  const [itemResults, setItemResults] = useState<Product[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Bundle | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchBundles = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/bundles")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setBundles(data.bundles || data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBundles()
  }, [fetchBundles])

  // Product search debounce
  useEffect(() => {
    if (!itemSearch.trim() || itemSearch.length < 2) {
      setItemResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(
          `/api/admin/products?search=${encodeURIComponent(itemSearch)}&limit=10`
        )
        if (res.ok) {
          const data = await res.json()
          setItemResults(
            (data.products || data || []).map(
              (p: Record<string, string>) => ({ id: p.id, name: p.name })
            )
          )
        }
      } catch {
        // ignore
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [itemSearch])

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(bundle: Bundle) {
    setEditingId(bundle.id)
    setForm({
      name: bundle.name,
      slug: bundle.slug,
      description: bundle.description || "",
      price: bundle.price,
      validFrom: bundle.validFrom
        ? new Date(bundle.validFrom).toISOString().slice(0, 10)
        : "",
      validUntil: bundle.validUntil
        ? new Date(bundle.validUntil).toISOString().slice(0, 10)
        : "",
      items: bundle.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
      })),
    })
    setModalOpen(true)
  }

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: !editingId ? slugify(name) : prev.slug,
    }))
  }

  function addItemRow() {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { productId: "", productName: "", quantity: 1 },
      ],
    }))
  }

  function removeItemRow(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  function selectProductForItem(index: number, product: Product) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? { ...item, productId: product.id, productName: product.name }
          : item
      ),
    }))
    setItemSearchIndex(null)
    setItemSearch("")
    setItemResults([])
  }

  function updateItemQuantity(index: number, quantity: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim() || !form.price) return
    setSaving(true)

    try {
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        validFrom: form.validFrom || null,
        validUntil: form.validUntil || null,
        items: form.items
          .filter((item) => item.productId)
          .map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
      }

      const url = editingId
        ? `/api/admin/bundles/${editingId}`
        : "/api/admin/bundles"
      const method = editingId ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Kaydetme hatasi")
        return
      }

      setModalOpen(false)
      await fetchBundles()
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
      const res = await fetch(`/api/admin/bundles/${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Silme hatasi")
        return
      }

      await fetchBundles()
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

  return (
    <div>
      <AdminHeader
        title="Paketler"
        breadcrumb={["Katalog", "Paketler"]}
        actions={
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] transition-colors"
          >
            <Plus size={16} />
            Yeni Paket
          </button>
        }
      />

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : bundles.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Gift size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Henuz paket olusturulmadi</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Paket
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Fiyat
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Urun Sayisi
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Aktif
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Gecerlilik
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bundles.map((bundle) => (
                  <tr key={bundle.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{bundle.name}</p>
                      <p className="text-xs text-gray-400 font-mono">
                        /{bundle.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#C4622D]">
                      {parseFloat(bundle.price).toLocaleString("tr-TR")}₺
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {bundle.items.length}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {bundle.isActive ? (
                        <ToggleRight size={28} className="text-[#C4622D] mx-auto" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {formatDate(bundle.validFrom)} - {formatDate(bundle.validUntil)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(bundle)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#C4622D]"
                          title="Duzenle"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(bundle)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                          title="Sil"
                        >
                          <Trash2 size={16} />
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

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Paketi Duzenle" : "Yeni Paket"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name + Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Paket Adi
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="orn. Anneler Gunu Paketi"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="orn. anneler-gunu-paketi"
                    className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Aciklama
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Paket aciklamasi..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  placeholder="0.00"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
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

              {/* Bundle Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-medium text-gray-600">
                    Paket Icerigi
                  </label>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1 text-xs text-[#C4622D] hover:text-[#A34E1F] font-medium"
                  >
                    <Plus size={14} />
                    Urun Ekle
                  </button>
                </div>

                {form.items.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-4 border border-dashed rounded-lg">
                    Henuz urun eklenmedi. &quot;Urun Ekle&quot; ile baslayın.
                  </p>
                )}

                <div className="space-y-3">
                  {form.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50"
                    >
                      {/* Product select */}
                      <div className="flex-1 relative">
                        {item.productId ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 flex-1">
                              {item.productName}
                            </span>
                            <button
                              onClick={() => {
                                setForm((prev) => ({
                                  ...prev,
                                  items: prev.items.map((it, i) =>
                                    i === index
                                      ? { ...it, productId: "", productName: "" }
                                      : it
                                  ),
                                }))
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="relative">
                              <Search
                                size={14}
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                              />
                              <input
                                type="text"
                                value={itemSearchIndex === index ? itemSearch : ""}
                                onFocus={() => setItemSearchIndex(index)}
                                onChange={(e) => {
                                  setItemSearchIndex(index)
                                  setItemSearch(e.target.value)
                                }}
                                placeholder="Urun ara..."
                                className="w-full border rounded-lg pl-8 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                              />
                              {searchLoading && itemSearchIndex === index && (
                                <Loader2
                                  size={14}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
                                />
                              )}
                            </div>
                            {itemSearchIndex === index &&
                              itemResults.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full border rounded-lg bg-white shadow-lg max-h-32 overflow-y-auto">
                                  {itemResults.map((p) => (
                                    <button
                                      key={p.id}
                                      onClick={() =>
                                        selectProductForItem(index, p)
                                      }
                                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 border-b last:border-b-0"
                                    >
                                      {p.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                          </>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="w-20">
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateItemQuantity(index, parseInt(e.target.value) || 1)
                          }
                          className="w-full border rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                        />
                        <span className="block text-[10px] text-gray-400 text-center mt-0.5">
                          Adet
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItemRow(index)}
                        className="p-1 text-gray-400 hover:text-red-600 mt-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
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
                disabled={saving || !form.name.trim() || !form.slug.trim() || !form.price}
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
          title="Paketi Sil"
          message={`"${deleteTarget.name}" paketi kalici olarak silinecek. Emin misiniz?`}
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

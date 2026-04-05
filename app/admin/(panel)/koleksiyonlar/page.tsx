"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import {
  Plus, Pencil, Trash2, Loader2, X, Search,
  ToggleLeft, ToggleRight, Star, Save, Sparkles,
} from "lucide-react"

interface Product {
  id: string
  name: string
  slug: string
}

interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
  isFeatured: boolean
  isActive: boolean
  _count?: { products: number }
  products?: { product: Product }[]
}

interface CollectionForm {
  name: string
  slug: string
  description: string
  productIds: string[]
}

const emptyForm: CollectionForm = {
  name: "",
  slug: "",
  description: "",
  productIds: [],
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function KoleksiyonlarPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CollectionForm>(emptyForm)

  // Product search
  const [productSearch, setProductSearch] = useState("")
  const [productResults, setProductResults] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Toggle loading tracker
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const fetchCollections = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/collections")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCollections(data.collections || data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  // Product search with debounce
  useEffect(() => {
    if (!productSearch.trim() || productSearch.length < 2) {
      setProductResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(
          `/api/admin/products?search=${encodeURIComponent(productSearch)}&limit=10`
        )
        if (res.ok) {
          const data = await res.json()
          const products: Product[] = (data.products || data || []).map(
            (p: Record<string, string>) => ({
              id: p.id,
              name: p.name,
              slug: p.slug,
            })
          )
          setProductResults(
            products.filter(
              (p) => !selectedProducts.some((sp) => sp.id === p.id)
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
  }, [productSearch, selectedProducts])

  function openNew() {
    setEditingId(null)
    setForm(emptyForm)
    setSelectedProducts([])
    setProductSearch("")
    setProductResults([])
    setModalOpen(true)
  }

  function openEdit(col: Collection) {
    setEditingId(col.id)
    setForm({
      name: col.name,
      slug: col.slug,
      description: col.description || "",
      productIds: col.products?.map((p) => p.product.id) || [],
    })
    setSelectedProducts(col.products?.map((p) => p.product) || [])
    setProductSearch("")
    setProductResults([])
    setModalOpen(true)
  }

  function addProduct(product: Product) {
    setSelectedProducts((prev) => [...prev, product])
    setForm((prev) => ({ ...prev, productIds: [...prev.productIds, product.id] }))
    setProductSearch("")
    setProductResults([])
  }

  function removeProduct(productId: string) {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId))
    setForm((prev) => ({
      ...prev,
      productIds: prev.productIds.filter((id) => id !== productId),
    }))
  }

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: !editingId ? slugify(name) : prev.slug,
    }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) return
    setSaving(true)

    try {
      const body = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        productIds: form.productIds,
      }

      const url = editingId
        ? `/api/admin/collections/${editingId}`
        : "/api/admin/collections"
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
      await fetchCollections()
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(
    id: string,
    field: "isFeatured" | "isActive",
    value: boolean
  ) {
    setTogglingId(id)
    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      })
      if (res.ok) {
        setCollections((prev) =>
          prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
        )
      }
    } catch {
      // ignore
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)

    try {
      const res = await fetch(`/api/admin/collections/${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Silme hatasi")
        return
      }

      await fetchCollections()
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setDeleteLoading(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div>
      <AdminHeader
        title="Koleksiyonlar"
        breadcrumb={["Katalog", "Koleksiyonlar"]}
        actions={
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#C4622D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] transition-colors"
          >
            <Plus size={16} />
            Yeni Koleksiyon
          </button>
        }
      />

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <Sparkles size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Henuz koleksiyon olusturulmadi</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Koleksiyon
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Urun Sayisi
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    One Cikan
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">
                    Aktif
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">
                    Islemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {collections.map((col) => (
                  <tr key={col.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{col.name}</p>
                      <p className="text-xs text-gray-400 font-mono">
                        /{col.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {col._count?.products ?? 0}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          handleToggle(col.id, "isFeatured", !col.isFeatured)
                        }
                        disabled={togglingId === col.id}
                        className="inline-flex"
                      >
                        {col.isFeatured ? (
                          <Star
                            size={20}
                            className="text-yellow-500 fill-yellow-500"
                          />
                        ) : (
                          <Star size={20} className="text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          handleToggle(col.id, "isActive", !col.isActive)
                        }
                        disabled={togglingId === col.id}
                      >
                        {col.isActive ? (
                          <ToggleRight size={28} className="text-[#C4622D]" />
                        ) : (
                          <ToggleLeft size={28} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(col)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#C4622D]"
                          title="Duzenle"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(col)}
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
          <div className="bg-white rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? "Koleksiyonu Duzenle" : "Yeni Koleksiyon"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Koleksiyon Adi
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="orn. Yaz Koleksiyonu"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              {/* Slug */}
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
                  placeholder="orn. yaz-koleksiyonu"
                  className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
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
                  placeholder="Koleksiyon aciklamasi..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>

              {/* Product Multi-select */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Urunler
                </label>

                {/* Selected products */}
                {selectedProducts.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedProducts.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1 bg-[#C4622D]/10 text-[#C4622D] px-2.5 py-1 rounded-full text-xs font-medium"
                      >
                        {p.name}
                        <button
                          onClick={() => removeProduct(p.id)}
                          className="hover:text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Search */}
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Urun ara..."
                    className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                  {searchLoading && (
                    <Loader2
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
                    />
                  )}
                </div>

                {/* Results dropdown */}
                {productResults.length > 0 && (
                  <div className="mt-1 border rounded-lg bg-white shadow-lg max-h-40 overflow-y-auto">
                    {productResults.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addProduct(p)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b last:border-b-0"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
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
                disabled={saving || !form.name.trim() || !form.slug.trim()}
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
          title="Koleksiyonu Sil"
          message={`"${deleteTarget.name}" koleksiyonu kalici olarak silinecek. Emin misiniz?`}
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

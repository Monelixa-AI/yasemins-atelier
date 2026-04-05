"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  FolderTree, Plus, ChevronRight, Trash2, Save, Loader2, ToggleLeft, ToggleRight,
} from "lucide-react"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  isActive: boolean
  _count?: { products: number }
  children?: Category[]
}

interface CategoryForm {
  name: string
  slug: string
  description: string
  parentId: string
  isActive: boolean
}

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  parentId: "",
  isActive: true,
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function KategorilerPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [flatCategories, setFlatCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<CategoryForm>(emptyForm)
  const [isNew, setIsNew] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories")
      if (!res.ok) throw new Error()
      const data = await res.json()
      const flat: Category[] = data.categories || data || []
      setFlatCategories(flat)
      setCategories(buildTree(flat))
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  function buildTree(flat: Category[]): Category[] {
    const map = new Map<string, Category>()
    const roots: Category[] = []

    flat.forEach((c) => map.set(c.id, { ...c, children: [] }))
    map.forEach((c) => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children!.push(c)
      } else {
        roots.push(c)
      }
    })
    return roots
  }

  function handleSelect(cat: Category) {
    setSelectedId(cat.id)
    setIsNew(false)
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      parentId: cat.parentId || "",
      isActive: cat.isActive,
    })
  }

  function handleNew() {
    setSelectedId(null)
    setIsNew(true)
    setForm(emptyForm)
  }

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isNew ? slugify(name) : prev.slug,
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
        parentId: form.parentId || null,
        isActive: form.isActive,
      }

      const url = isNew
        ? "/api/admin/categories"
        : `/api/admin/categories/${selectedId}`
      const method = isNew ? "POST" : "PATCH"

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

      await fetchCategories()
      if (isNew) {
        setIsNew(false)
        const created = await res.json().catch(() => null)
        if (created?.id) setSelectedId(created.id)
      }
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
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Silme hatasi")
        return
      }

      if (selectedId === deleteTarget.id) {
        setSelectedId(null)
        setIsNew(false)
        setForm(emptyForm)
      }

      await fetchCategories()
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setDeleteLoading(false)
      setDeleteTarget(null)
    }
  }

  function renderTree(items: Category[], depth = 0) {
    return items.map((cat) => (
      <div key={cat.id}>
        <button
          onClick={() => handleSelect(cat)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
            selectedId === cat.id
              ? "bg-[#C4622D]/10 text-[#C4622D] font-medium"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
        >
          {cat.children && cat.children.length > 0 && (
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
          )}
          {(!cat.children || cat.children.length === 0) && (
            <span className="w-3.5 shrink-0" />
          )}
          <span className="flex-1 truncate">{cat.name}</span>
          {!cat.isActive && (
            <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">
              Pasif
            </span>
          )}
          <span className="text-xs text-gray-400 shrink-0">
            {cat._count?.products ?? 0}
          </span>
        </button>
        {cat.children && cat.children.length > 0 && renderTree(cat.children, depth + 1)}
      </div>
    ))
  }

  const selectedCategory = flatCategories.find((c) => c.id === selectedId)
  const canDelete = selectedCategory && (selectedCategory._count?.products ?? 0) === 0

  return (
    <div>
      <AdminHeader
        title="Kategoriler"
        breadcrumb={["Katalog", "Kategoriler"]}
      />

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        {/* Left: Category Tree */}
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FolderTree size={16} className="text-[#B8975C]" />
              Kategori Agaci
            </h3>
            <button
              onClick={handleNew}
              className="flex items-center gap-1 text-xs text-[#C4622D] hover:text-[#A34E1F] font-medium"
            >
              <Plus size={14} />
              Yeni Kategori
            </button>
          </div>

          <div className="p-2 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Henuz kategori yok
              </p>
            ) : (
              renderTree(categories)
            )}
          </div>
        </div>

        {/* Right: Edit Form */}
        <div className="bg-white border rounded-xl overflow-hidden">
          {!isNew && !selectedId ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <FolderTree size={40} className="mb-3 text-gray-300" />
              <p className="text-sm">
                Duzenlemek icin bir kategori secin veya yeni olusturun
              </p>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-sm font-medium text-gray-700">
                  {isNew ? "Yeni Kategori" : `Duzenle: ${form.name}`}
                </h3>
              </div>

              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Kategori Adi
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="orn. Pastalar"
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
                    placeholder="orn. pastalar"
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
                      setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={3}
                    placeholder="Kategori aciklamasi..."
                    className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  />
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Ust Kategori
                  </label>
                  <select
                    value={form.parentId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, parentId: e.target.value }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                  >
                    <option value="">Ust kategori yok (Ana kategori)</option>
                    {flatCategories
                      .filter((c) => c.id !== selectedId)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* isActive Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Aktif</p>
                    <p className="text-xs text-gray-400">
                      Pasif kategoriler sitede gorunmez
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                    }
                    className="text-[#C4622D]"
                  >
                    {form.isActive ? (
                      <ToggleRight size={32} />
                    ) : (
                      <ToggleLeft size={32} className="text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  {!isNew && canDelete && (
                    <button
                      onClick={() =>
                        selectedCategory && setDeleteTarget(selectedCategory)
                      }
                      className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                      Sil
                    </button>
                  )}
                  {!isNew && !canDelete && selectedCategory && (
                    <p className="text-xs text-gray-400">
                      Urunu olan kategori silinemez
                    </p>
                  )}
                  {isNew && <div />}

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
            </>
          )}
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Kategoriyi Sil"
          message={`"${deleteTarget.name}" kategorisi kalici olarak silinecek. Emin misiniz?`}
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

"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import { Plus, Search, ImageIcon, Trash2, Pencil } from "lucide-react"

/* ---------- types ---------- */
interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  slug: string
  basePrice: string | number
  stockCount: number | null
  status: string
  isNaturel: boolean
  images: { url: string }[]
  category: { id: string; name: string } | null
}

interface ProductsResponse {
  products: Product[]
  page: number
  totalPages: number
  total: number
}

/* ---------- component ---------- */
export default function AdminProductsPage() {
  /* data */
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  /* filters */
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [status, setStatus] = useState("")
  const [isNaturel, setIsNaturel] = useState(false)
  const [page, setPage] = useState(1)

  /* delete confirm */
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  /* fetch categories once */
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? d ?? []))
      .catch(() => {})
  }, [])

  /* fetch products */
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", String(page))
    if (search) params.set("search", search)
    if (categoryId) params.set("categoryId", categoryId)
    if (status) params.set("status", status)
    if (isNaturel) params.set("isNaturel", "true")

    try {
      const res = await fetch("/api/admin/products?" + params.toString())
      if (res.ok) setData(await res.json())
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [page, search, categoryId, status, isNaturel])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  /* reset page on filter change */
  useEffect(() => {
    setPage(1)
  }, [search, categoryId, status, isNaturel])

  /* delete handler */
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch("/api/admin/products/" + deleteTarget.id, {
        method: "DELETE",
      })
      if (res.ok) {
        setDeleteTarget(null)
        fetchProducts()
      } else {
        const body = await res.json()
        alert(body.error || "Silme işlemi başarısız oldu.")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setDeleteLoading(false)
    }
  }

  /* columns */
  const columns: Column<Product>[] = [
    {
      key: "image",
      label: "Görsel",
      className: "w-16",
      render: (row) => {
        const src = row.images?.[0]?.url
        return src ? (
          <img
            src={src}
            alt={row.name}
            className="w-12 h-12 rounded-lg object-cover border"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <ImageIcon size={18} className="text-gray-300" />
          </div>
        )
      },
    },
    {
      key: "name",
      label: "Ürün Adı",
      render: (row) => (
        <Link
          href={"/admin/urunler/" + row.id + "/duzenle"}
          className="hover:text-[#C4622D] transition-colors"
        >
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-400">/{row.slug}</p>
        </Link>
      ),
    },
    {
      key: "category",
      label: "Kategori",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {row.category?.name ?? "\u2014"}
        </span>
      ),
    },
    {
      key: "basePrice",
      label: "Fiyat",
      className: "text-right",
      render: (row) => (
        <span className="font-medium">
          {Number(row.basePrice).toLocaleString("tr-TR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })}
          {"\u20BA"}
        </span>
      ),
    },
    {
      key: "stockCount",
      label: "Stok",
      className: "text-right",
      render: (row) => (
        <span className={row.stockCount !== null && row.stockCount <= 5 ? "text-red-600 font-medium" : "text-gray-700"}>
          {row.stockCount !== null ? row.stockCount : "\u2014"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Durum",
      render: (row) => <StatusBadge status={row.status} type="product" />,
    },
    {
      key: "actions",
      label: "İşlemler",
      className: "w-32",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={"/admin/urunler/" + row.id + "/duzenle"}
            className="inline-flex items-center gap-1 text-xs text-[#C4622D] hover:underline"
          >
            <Pencil size={14} />
            Düzenle
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setDeleteTarget(row)
            }}
            className="inline-flex items-center gap-1 text-xs text-red-500 hover:underline"
          >
            <Trash2 size={14} />
            Sil
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      {/* header */}
      <AdminHeader
        title="Ürünler"
        actions={
          <Link
            href="/admin/urunler/yeni"
            className="inline-flex items-center gap-2 bg-[#C4622D] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#A34F22] transition-colors"
          >
            <Plus size={16} />
            Yeni Ürün Ekle
          </Link>
        }
      />

      {/* filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
          />
        </div>

        {/* category */}
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30"
        >
          <option value="">Tüm Durumlar</option>
          <option value="ACTIVE">Aktif</option>
          <option value="INACTIVE">Pasif</option>
          <option value="OUT_OF_STOCK">Stokta Yok</option>
        </select>

        {/* naturel toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setIsNaturel(!isNaturel)}
            className={"relative w-10 h-5 rounded-full transition-colors " + (isNaturel ? "bg-[#4A7C3F]" : "bg-gray-300")}
          >
            <div
              className={"absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform " + (isNaturel ? "translate-x-5" : "translate-x-0")}
            />
          </div>
          <span className="text-sm text-gray-600">Naturel</span>
        </label>
      </div>

      {/* table */}
      <DataTable<Product>
        columns={columns}
        data={data?.products ?? []}
        loading={loading}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        emptyMessage="Ürün bulunamadı"
      />

      {/* total count */}
      {!loading && data && (
        <p className="text-xs text-gray-400 mt-3">
          Toplam {data.total} ürün
        </p>
      )}

      {/* delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Ürünü Sil"
          message={'"' + deleteTarget.name + '" ürününü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'}
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

"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import { StatusBadge } from "@/components/admin/ui/StatusBadge"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react"

/* ---------- types ---------- */
interface BlogPost {
  id: string
  title: string
  slug: string
  status: string
  publishedAt: string | null
  createdAt: string
  viewCount: number
  coverImage: string | null
}

interface BlogResponse {
  posts: BlogPost[]
  page: number
  totalPages: number
  total: number
}

/* ---------- component ---------- */
export default function AdminBlogPage() {
  /* data */
  const [data, setData] = useState<BlogResponse | null>(null)
  const [loading, setLoading] = useState(true)

  /* filters */
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)

  /* delete confirm */
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  /* fetch posts */
  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", String(page))
    if (search) params.set("search", search)
    if (status) params.set("status", status)

    try {
      const res = await fetch("/api/admin/blog?" + params.toString())
      if (res.ok) setData(await res.json())
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [page, search, status])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  /* reset page on filter change */
  useEffect(() => {
    setPage(1)
  }, [search, status])

  /* delete handler */
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch("/api/admin/blog/" + deleteTarget.id, {
        method: "DELETE",
      })
      if (res.ok) {
        setDeleteTarget(null)
        fetchPosts()
      } else {
        const body = await res.json()
        alert(body.error || "Silme islemi basarisiz oldu.")
      }
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setDeleteLoading(false)
    }
  }

  /* format date */
  const fmtDate = (dateStr: string | null) => {
    if (!dateStr) return "\u2014"
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  /* columns */
  const columns: Column<BlogPost>[] = [
    {
      key: "title",
      label: "Baslik",
      render: (row) => (
        <Link
          href={"/admin/blog/" + row.id + "/duzenle"}
          className="hover:text-[#C4622D] transition-colors"
        >
          <p className="font-medium text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-400">/{row.slug}</p>
        </Link>
      ),
    },
    {
      key: "status",
      label: "Durum",
      render: (row) => <StatusBadge status={row.status} type="blog" />,
    },
    {
      key: "date",
      label: "Tarih",
      render: (row) => (
        <span className="text-sm text-gray-600">
          {fmtDate(row.publishedAt || row.createdAt)}
        </span>
      ),
    },
    {
      key: "viewCount",
      label: "Goruntuleme",
      className: "text-right",
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
          <Eye size={14} className="text-gray-400" />
          {row.viewCount.toLocaleString("tr-TR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Islemler",
      className: "w-36",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={"/admin/blog/" + row.id + "/duzenle"}
            className="inline-flex items-center gap-1 text-xs text-[#C4622D] hover:underline"
          >
            <Pencil size={14} />
            Duzenle
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
        title="Blog"
        actions={
          <Link
            href="/admin/blog/yeni"
            className="inline-flex items-center gap-2 bg-[#C4622D] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#A34F22] transition-colors"
          >
            <Plus size={16} />
            Yeni Yazi
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
            placeholder="Yazi ara..."
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
          />
        </div>

        {/* status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30"
        >
          <option value="">Tum Durumlar</option>
          <option value="DRAFT">Taslak</option>
          <option value="PUBLISHED">Yayinda</option>
          <option value="SCHEDULED">Zamanlanmis</option>
        </select>
      </div>

      {/* table */}
      <DataTable<BlogPost>
        columns={columns}
        data={data?.posts ?? []}
        loading={loading}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
        emptyMessage="Blog yazisi bulunamadi"
      />

      {/* total count */}
      {!loading && data && (
        <p className="text-xs text-gray-400 mt-3">
          Toplam {data.total} yazi
        </p>
      )}

      {/* delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Yaziyi Sil"
          message={
            '"' +
            deleteTarget.title +
            '" yazisini silmek istediginizden emin misiniz? Bu islem geri alinamaz.'
          }
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

"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import { Plus, Pencil, Trash2 } from "lucide-react"

/* ---------- types ---------- */
interface Page {
  id: string
  title: string
  slug: string
  status: "PUBLISHED" | "DRAFT"
  updatedAt: string
}

interface PagesResponse {
  pages: Page[]
  total: number
}

/* ---------- component ---------- */
export default function AdminPagesPage() {
  const [data, setData] = useState<PagesResponse | null>(null)
  const [loading, setLoading] = useState(true)

  /* delete */
  const [deleteTarget, setDeleteTarget] = useState<Page | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  /* fetch */
  const fetchPages = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/pages")
      if (res.ok) setData(await res.json())
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  /* delete handler */
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch("/api/admin/pages/" + deleteTarget.id, {
        method: "DELETE",
      })
      if (res.ok) {
        setDeleteTarget(null)
        fetchPages()
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

  /* format date */
  const fmtDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  /* columns */
  const columns: Column<Page>[] = [
    {
      key: "title",
      label: "Başlık",
      render: (row) => (
        <Link
          href={"/admin/sayfalar/" + row.id + "/duzenle"}
          className="hover:text-[#C4622D] transition-colors"
        >
          <p className="font-medium text-gray-900">{row.title}</p>
        </Link>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (row) => (
        <span className="text-sm text-gray-500 font-mono">/{row.slug}</span>
      ),
    },
    {
      key: "status",
      label: "Durum",
      render: (row) => (
        <span
          className={
            "inline-block rounded-full px-2 py-0.5 text-xs font-medium " +
            (row.status === "PUBLISHED"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700")
          }
        >
          {row.status === "PUBLISHED" ? "Yayında" : "Taslak"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Son Güncelleme",
      render: (row) => (
        <span className="text-sm text-gray-600">{fmtDate(row.updatedAt)}</span>
      ),
    },
    {
      key: "actions",
      label: "İşlemler",
      className: "w-36",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={"/admin/sayfalar/" + row.id + "/duzenle"}
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
        title="Sayfalar"
        actions={
          <Link
            href="/admin/sayfalar/yeni"
            className="inline-flex items-center gap-2 bg-[#C4622D] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#A34F22] transition-colors"
          >
            <Plus size={16} />
            Yeni Sayfa
          </Link>
        }
      />

      {/* table */}
      <DataTable<Page>
        columns={columns}
        data={data?.pages ?? []}
        loading={loading}
        emptyMessage="Henüz sayfa oluşturulmamış"
      />

      {/* total */}
      {!loading && data && (
        <p className="text-xs text-gray-400 mt-3">
          Toplam {data.total} sayfa
        </p>
      )}

      {/* delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Sayfayı Sil"
          message={
            '"' +
            deleteTarget.title +
            '" sayfasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
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

"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { DataTable, Column } from "@/components/admin/ui/DataTable"
import {
  Star, Loader2, Check, XCircle, MessageSquare, X, Save,
} from "lucide-react"

interface Review {
  id: string
  rating: number
  title: string | null
  body: string
  status: string
  adminReply: string | null
  isPinned: boolean
  createdAt: string
  product: { id: string; name: string; slug: string }
  user: { id: string; name: string | null; email: string }
}

type TabStatus = "PENDING" | "APPROVED" | "REJECTED"

const TABS: { key: TabStatus; label: string }[] = [
  { key: "PENDING", label: "Bekleyen" },
  { key: "APPROVED", label: "Onayli" },
  { key: "REJECTED", label: "Reddedilen" },
]

export default function YorumlarPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState<TabStatus>("PENDING")

  // Reply modal
  const [replyTarget, setReplyTarget] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState("")
  const [savingReply, setSavingReply] = useState(false)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("status", activeTab)
      params.set("page", String(page))

      const res = await fetch(`/api/admin/reviews?${params}`)
      const data = await res.json()
      setReviews(data.reviews ?? [])
      setTotalPages(data.totalPages ?? 1)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [activeTab, page])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  function handleTabChange(tab: TabStatus) {
    setActiveTab(tab)
    setPage(1)
  }

  async function handleStatusChange(id: string, status: string) {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (res.ok) {
        await fetchReviews()
      }
    } catch {
      alert("Islem hatasi")
    }
  }

  function openReplyModal(review: Review) {
    setReplyTarget(review)
    setReplyText(review.adminReply || "")
  }

  async function handleSaveReply() {
    if (!replyTarget) return
    setSavingReply(true)
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: replyTarget.id,
          adminReply: replyText.trim() || null,
        }),
      })

      if (res.ok) {
        setReplyTarget(null)
        setReplyText("")
        await fetchReviews()
      }
    } catch {
      alert("Yanit kaydedilemedi")
    } finally {
      setSavingReply(false)
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < rating
                ? "text-amber-400 fill-amber-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    )
  }

  const columns: Column<Review>[] = [
    {
      key: "product",
      label: "Urun",
      render: (row) => (
        <span className="text-sm font-medium text-gray-900 truncate max-w-[160px] block">
          {row.product.name}
        </span>
      ),
    },
    {
      key: "user",
      label: "Musteri",
      render: (row) => (
        <span className="text-xs text-gray-700">
          {row.user.name || row.user.email}
        </span>
      ),
    },
    {
      key: "rating",
      label: "Puan",
      render: (row) => renderStars(row.rating),
    },
    {
      key: "body",
      label: "Yorum",
      render: (row) => (
        <p className="text-xs text-gray-600 truncate max-w-[200px]">
          {row.body}
        </p>
      ),
    },
    {
      key: "createdAt",
      label: "Tarih",
      render: (row) => (
        <span className="text-xs text-gray-500">
          {new Date(row.createdAt).toLocaleDateString("tr-TR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Islemler",
      className: "w-[180px]",
      render: (row) => (
        <div className="flex items-center gap-1">
          {activeTab !== "APPROVED" && (
            <button
              onClick={() => handleStatusChange(row.id, "APPROVED")}
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-50"
              title="Onayla"
            >
              <Check size={14} />
              Onayla
            </button>
          )}
          {activeTab !== "REJECTED" && (
            <button
              onClick={() => handleStatusChange(row.id, "REJECTED")}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
              title="Reddet"
            >
              <XCircle size={14} />
              Reddet
            </button>
          )}
          <button
            onClick={() => openReplyModal(row)}
            className="flex items-center gap-1 text-xs text-[#C4622D] hover:text-[#A34E1F] px-2 py-1 rounded hover:bg-[#C4622D]/5"
            title="Yanitla"
          >
            <MessageSquare size={14} />
            Yanitla
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader title="Yorumlar" breadcrumb={["CRM", "Yorumlar"]} />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable<Review>
        columns={columns}
        data={reviews}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        emptyMessage="Yorum bulunamadi"
      />

      {/* Reply Modal */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">Yoruma Yanit</h3>
              <button
                onClick={() => setReplyTarget(null)}
                className="p-1 rounded hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Original Review */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {replyTarget.user.name || replyTarget.user.email}
                  </span>
                  {renderStars(replyTarget.rating)}
                </div>
                <p className="text-xs text-gray-600">{replyTarget.body}</p>
              </div>

              {/* Reply */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Admin Yaniti
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Yanitinizi yazin..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button
                onClick={() => setReplyTarget(null)}
                className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
              >
                Iptal
              </button>
              <button
                onClick={handleSaveReply}
                disabled={savingReply}
                className="flex items-center gap-2 bg-[#C4622D] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
              >
                {savingReply ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

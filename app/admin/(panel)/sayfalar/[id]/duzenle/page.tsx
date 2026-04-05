"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Loader2 } from "lucide-react"

const TipTapEditor = dynamic(() => import("@/components/admin/editor/TipTapEditor"), { ssr: false })

interface PageData {
  id: string
  title: string
  slug: string
  content: { html: string } | string
  isPublished: boolean
  metaTitle: string | null
  metaDesc: string | null
}

export default function EditPagePage() {
  const params = useParams()
  const router = useRouter()
  const [page, setPage] = useState<PageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [content, setContent] = useState("")
  const [isPublished, setIsPublished] = useState(false)
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDesc, setMetaDesc] = useState("")

  useEffect(() => {
    async function fetchPage() {
      try {
        const res = await fetch(`/api/admin/pages/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setPage(data)
          setTitle(data.title)
          setSlug(data.slug)
          setContent(typeof data.content === "object" ? data.content.html || "" : data.content || "")
          setIsPublished(data.isPublished)
          setMetaTitle(data.metaTitle || "")
          setMetaDesc(data.metaDesc || "")
        }
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetchPage()
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/pages/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content: { html: content },
          isPublished,
          metaTitle: metaTitle || null,
          metaDesc: metaDesc || null,
        }),
      })
      router.push("/admin/sayfalar")
    } catch {
      alert("Kaydetme hatası")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    )
  }

  return (
    <div>
      <AdminHeader
        title={`Sayfa Düzenle: ${page?.title || ""}`}
        breadcrumb={["Sayfalar", "Düzenle"]}
        actions={
          <button onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-[#C4622D] text-white text-sm rounded-lg hover:bg-[#A34E1F] disabled:opacity-50">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        }
      />

      <div className="grid lg:grid-cols-[1fr,300px] gap-6">
        <div className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold border-0 border-b-2 border-gray-200 pb-2 focus:outline-none focus:border-[#C4622D]"
            placeholder="Sayfa başlığı"
          />
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        <div className="space-y-4">
          <div className="bg-white border rounded-xl p-4 space-y-3">
            <h3 className="font-medium text-gray-900 text-sm">Ayarlar</h3>
            <div>
              <label className="text-xs text-gray-500">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full border rounded px-3 py-1.5 text-sm mt-1" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="accent-[#C4622D]" />
              Yayında
            </label>
          </div>

          <div className="bg-white border rounded-xl p-4 space-y-3">
            <h3 className="font-medium text-gray-900 text-sm">SEO</h3>
            <div>
              <label className="text-xs text-gray-500">Meta Başlık</label>
              <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full border rounded px-3 py-1.5 text-sm mt-1" maxLength={60} />
            </div>
            <div>
              <label className="text-xs text-gray-500">Meta Açıklama</label>
              <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full border rounded px-3 py-1.5 text-sm mt-1 resize-none" rows={3} maxLength={160} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

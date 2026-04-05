"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useDropzone } from "react-dropzone"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  Loader2,
  Upload,
  X,
  Save,
  Send,
  Clock,
} from "lucide-react"

/* TipTap is client-only — lazy load to avoid SSR issues */
const TipTapEditor = dynamic(
  () => import("@/components/admin/editor/TipTapEditor"),
  { ssr: false, loading: () => <div className="border rounded-xl bg-white min-h-[500px] flex items-center justify-center text-gray-400 text-sm">Editör yükleniyor...</div> }
)

/* ---------- helpers ---------- */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[âçığöşüÂÇİĞÖŞÜ]/g, (c) => {
      const map: Record<string, string> = {
        â: "a", ç: "c", ı: "i", ğ: "g", ö: "o", ş: "s", ü: "u",
        Â: "a", Ç: "c", İ: "i", Ğ: "g", Ö: "o", Ş: "s", Ü: "u",
      }
      return map[c] || c
    })
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/* ---------- types ---------- */
interface FormState {
  title: string
  slug: string
  content: string
  status: "DRAFT" | "PUBLISHED" | "SCHEDULED"
  excerpt: string
  coverImage: string
  metaTitle: string
  metaDesc: string
  readingMins: string
}

const INITIAL: FormState = {
  title: "",
  slug: "",
  content: "",
  status: "DRAFT",
  excerpt: "",
  coverImage: "",
  metaTitle: "",
  metaDesc: "",
  readingMins: "",
}

/* ---------- component ---------- */
export default function NewBlogPostPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [coverUploading, setCoverUploading] = useState(false)

  /* helper to update form */
  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: val }))

  /* title -> slug auto */
  const handleTitleChange = (value: string) => {
    const prevSlug = slugify(form.title)
    set("title", value)
    if (form.slug === "" || form.slug === prevSlug) {
      set("slug", slugify(value))
    }
  }

  /* cover image dropzone */
  const onDropCover = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setCoverUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      if (res.ok) {
        const data = await res.json()
        set("coverImage", data.url)
      }
    } catch {
      /* ignore */
    } finally {
      setCoverUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCover,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
  })

  /* save */
  const handleSave = async (publishNow?: boolean) => {
    if (!form.title.trim()) {
      alert("Başlık zorunludur.")
      return
    }
    setSaving(true)
    const body = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      content: form.content,
      status: publishNow ? "PUBLISHED" : form.status,
      excerpt: form.excerpt,
      coverImage: form.coverImage || null,
      metaTitle: form.metaTitle,
      metaDesc: form.metaDesc,
      readingMins: form.readingMins ? parseInt(form.readingMins) : null,
    }

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        router.push("/admin/blog")
      } else {
        const err = await res.json()
        alert(err.error || "Yazı kaydedilemedi.")
      }
    } catch {
      alert("Bağlantı hatası")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="pb-8">
      {/* header */}
      <AdminHeader
        title="Yeni Blog Yazısı"
        breadcrumb={["Blog", "Yeni"]}
        actions={
          <Link
            href="/admin/blog"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            İptal
          </Link>
        }
      />

      {/* two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT — Editor (65%) */}
        <div className="lg:w-[65%] space-y-4">
          {/* title */}
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Yazı başlığı"
            className="w-full text-2xl font-semibold border-0 border-b-2 border-gray-200 bg-transparent px-1 py-3 focus:outline-none focus:border-[#C4622D] placeholder:text-gray-300 transition-colors"
          />

          {/* TipTap editor */}
          <TipTapEditor
            content={form.content}
            onChange={(html) => set("content", html)}
          />
        </div>

        {/* RIGHT — Settings (35%) */}
        <div className="lg:w-[35%]">
          <div className="lg:sticky lg:top-6 space-y-5">
            {/* status + actions card */}
            <div className="bg-white border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Yayın Ayarları</h3>

              {/* status select */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Durum
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    set("status", e.target.value as FormState["status"])
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                >
                  <option value="DRAFT">Taslak</option>
                  <option value="PUBLISHED">Yayında</option>
                  <option value="SCHEDULED">Zamanlanmış</option>
                </select>
              </div>

              {/* action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-[#C4622D] text-[#C4622D] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#C4622D]/5 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Kaydet
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-[#C4622D] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#A34F22] transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Yayınla
                </button>
              </div>
            </div>

            {/* cover image */}
            <div className="bg-white border rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Kapak Görseli</h3>

              {form.coverImage ? (
                <div className="relative group">
                  <img
                    src={form.coverImage}
                    alt="Kapak"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <button
                    onClick={() => set("coverImage", "")}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors " +
                    (isDragActive
                      ? "border-[#C4622D] bg-[#C4622D]/5"
                      : "border-gray-300 hover:border-gray-400")
                  }
                >
                  <input {...getInputProps()} />
                  {coverUploading ? (
                    <Loader2
                      size={24}
                      className="mx-auto animate-spin text-gray-400"
                    />
                  ) : (
                    <>
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        Sürükle bırak veya tıkla
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* excerpt */}
            <div className="bg-white border rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Özet</h3>
              <textarea
                value={form.excerpt}
                onChange={(e) => {
                  if (e.target.value.length <= 200) set("excerpt", e.target.value)
                }}
                rows={3}
                placeholder="Kısa özet (maks. 200 karakter)..."
                className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
              />
              <p className="text-xs text-gray-400 text-right">
                {form.excerpt.length}/200
              </p>
            </div>

            {/* slug */}
            <div className="bg-white border rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Slug (URL)</h3>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">/blog/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                />
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white border rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">SEO</h3>

              {/* metaTitle */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Meta Başlık
                  <span
                    className={
                      "ml-1 " +
                      (form.metaTitle.length > 60
                        ? "text-red-500"
                        : "text-gray-400")
                    }
                  >
                    {form.metaTitle.length}/60
                  </span>
                </label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(e) => set("metaTitle", e.target.value)}
                  placeholder={form.title || "Yazı başlığı"}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                />
              </div>

              {/* metaDesc */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Meta Açıklama
                  <span
                    className={
                      "ml-1 " +
                      (form.metaDesc.length > 160
                        ? "text-red-500"
                        : "text-gray-400")
                    }
                  >
                    {form.metaDesc.length}/160
                  </span>
                </label>
                <textarea
                  value={form.metaDesc}
                  onChange={(e) => set("metaDesc", e.target.value)}
                  rows={2}
                  placeholder="Arama motorları için açıklama..."
                  className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                />
              </div>

              {/* readingMins */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Okuma Süresi (dk)
                </label>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    value={form.readingMins}
                    onChange={(e) => set("readingMins", e.target.value)}
                    placeholder="5"
                    className="w-24 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                  />
                  <span className="text-xs text-gray-400">dakika</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

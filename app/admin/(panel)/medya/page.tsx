"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"
import {
  Upload,
  Grid3X3,
  List,
  X,
  Loader2,
  Copy,
  Trash2,
  Save,
  Check,
  ImageIcon,
  FileIcon,
} from "lucide-react"

/* ---------- types ---------- */
interface MediaItem {
  id: string
  filename: string
  url: string
  mimeType: string
  sizeBytes: number
  altText: string | null
  createdAt: string
}

interface MediaResponse {
  items: MediaItem[]
  total: number
}

/* ---------- helpers ---------- */
function fmtSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function isImage(mime: string): boolean {
  return mime.startsWith("image/")
}

/* ---------- component ---------- */
export default function AdminMediaPage() {
  const [data, setData] = useState<MediaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  /* detail panel */
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [altText, setAltText] = useState("")
  const [altSaving, setAltSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  /* delete */
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  /* file input ref */
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* fetch media */
  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/media")
      if (res.ok) setData(await res.json())
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  /* upload handler */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData()
        fd.append("file", files[i])
        await fetch("/api/admin/media", { method: "POST", body: fd })
      }
      fetchMedia()
    } catch {
      alert("Yükleme sırasında hata oluştu.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  /* select item */
  const handleSelect = (item: MediaItem) => {
    setSelected(item)
    setAltText(item.altText || "")
    setCopied(false)
  }

  /* save alt text */
  const handleSaveAlt = async () => {
    if (!selected) return
    setAltSaving(true)
    try {
      const res = await fetch("/api/admin/media/" + selected.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText }),
      })
      if (res.ok) {
        const updated = await res.json()
        setSelected(updated)
        setData((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.map((it) =>
                  it.id === updated.id ? updated : it
                ),
              }
            : prev
        )
      }
    } catch {
      alert("Kaydetme hatası")
    } finally {
      setAltSaving(false)
    }
  }

  /* copy url */
  const handleCopyUrl = () => {
    if (!selected) return
    navigator.clipboard.writeText(selected.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* delete handler */
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch("/api/admin/media/" + deleteTarget.id, {
        method: "DELETE",
      })
      if (res.ok) {
        if (selected?.id === deleteTarget.id) setSelected(null)
        setDeleteTarget(null)
        fetchMedia()
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

  return (
    <div>
      {/* hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        multiple
        className="hidden"
        onChange={handleUpload}
      />

      {/* header */}
      <AdminHeader
        title="Medya Kütüphanesi"
        actions={
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-[#C4622D] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#A34F22] transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            Yükle
          </button>
        }
      />

      {/* toolbar: view toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-400">
          {!loading && data && <>Toplam {data.total} dosya</>}
        </p>
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode("grid")}
            className={
              "p-2 text-sm transition-colors " +
              (viewMode === "grid"
                ? "bg-[#C4622D] text-white"
                : "bg-white text-gray-500 hover:bg-gray-50")
            }
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={
              "p-2 text-sm transition-colors " +
              (viewMode === "list"
                ? "bg-[#C4622D] text-white"
                : "bg-white text-gray-500 hover:bg-gray-50")
            }
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* main area */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-5 gap-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="bg-white border rounded-xl p-12 text-center">
              <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">
                Henüz medya dosyası yüklenmemiş
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* ---- GRID VIEW ---- */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {data.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={
                    "group text-left rounded-lg overflow-hidden border-2 transition-colors " +
                    (selected?.id === item.id
                      ? "border-[#C4622D]"
                      : "border-transparent hover:border-gray-300")
                  }
                >
                  <div className="aspect-square bg-gray-100 relative">
                    {isImage(item.mimeType) ? (
                      <img
                        src={item.url}
                        alt={item.altText || item.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileIcon size={32} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="px-2 py-1.5 bg-white">
                    <p className="text-xs text-gray-700 truncate">
                      {item.filename}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {fmtSize(item.sizeBytes)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* ---- LIST VIEW ---- */
            <div className="bg-white border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 w-16">
                      Önizleme
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Dosya Adı
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Tür
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">
                      Boyut
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Tarih
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.items.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={
                        "cursor-pointer hover:bg-gray-50 " +
                        (selected?.id === item.id ? "bg-[#C4622D]/5" : "")
                      }
                    >
                      <td className="px-4 py-2">
                        {isImage(item.mimeType) ? (
                          <img
                            src={item.url}
                            alt={item.altText || item.filename}
                            className="w-10 h-10 rounded object-cover border"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                            <FileIcon size={16} className="text-gray-300" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <p className="text-gray-900 truncate max-w-[200px]">
                          {item.filename}
                        </p>
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {item.mimeType}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-500">
                        {fmtSize(item.sizeBytes)}
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {fmtDate(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* detail side panel */}
        {selected && (
          <div className="w-80 shrink-0">
            <div className="bg-white border rounded-xl overflow-hidden sticky top-6">
              {/* close */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-sm font-semibold text-gray-700">Detay</h3>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>

              {/* preview */}
              <div className="p-4">
                {isImage(selected.mimeType) ? (
                  <img
                    src={selected.url}
                    alt={selected.altText || selected.filename}
                    className="w-full rounded-lg object-contain max-h-56 bg-gray-50"
                  />
                ) : (
                  <div className="w-full h-40 rounded-lg bg-gray-50 flex items-center justify-center">
                    <FileIcon size={48} className="text-gray-300" />
                  </div>
                )}
              </div>

              {/* info */}
              <div className="px-4 pb-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Dosya Adı</p>
                  <p className="text-sm text-gray-900 break-all">
                    {selected.filename}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Boyut</p>
                    <p className="text-sm text-gray-700">
                      {fmtSize(selected.sizeBytes)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Tür</p>
                    <p className="text-sm text-gray-700">
                      {selected.mimeType}
                    </p>
                  </div>
                </div>

                {/* alt text */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Alt Metin
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Görsel açıklaması..."
                      className="flex-1 border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
                    />
                    <button
                      onClick={handleSaveAlt}
                      disabled={altSaving}
                      className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      title="Kaydet"
                    >
                      {altSaving ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Save size={14} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* url copy */}
                <button
                  onClick={handleCopyUrl}
                  className="w-full flex items-center justify-center gap-2 border rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-500" />
                      Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      URL Kopyala
                    </>
                  )}
                </button>

                {/* delete */}
                <button
                  onClick={() => setDeleteTarget(selected)}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Dosyayı Sil"
          message={
            '"' +
            deleteTarget.filename +
            '" dosyasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.'
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

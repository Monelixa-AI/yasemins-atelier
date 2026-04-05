"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Loader2, Plus, Trash2, ToggleLeft, ToggleRight, Eye, MousePointerClick } from "lucide-react"
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal"

interface PopupRow {
  id: string; name: string; type: string; trigger: string
  isActive: boolean; impressions: number; conversions: number
  title: string
}

interface BannerRow {
  id: string; name: string; content: string; bgColor: string
  textColor: string; isActive: boolean; position: string; clicks: number
}

export default function PopupBannerPage() {
  const [tab, setTab] = useState<"popups" | "banners">("popups")
  const [popups, setPopups] = useState<PopupRow[]>([])
  const [banners, setBanners] = useState<BannerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Popup form
  const [showPopupForm, setShowPopupForm] = useState(false)
  const [popupForm, setPopupForm] = useState({
    name: "", type: "EMAIL_CAPTURE", title: "", subtitle: "", body: "",
    ctaText: "", ctaUrl: "", inputPlaceholder: "E-posta adresiniz",
    trigger: "TIME_DELAY", triggerDelay: 5, triggerScroll: 50,
    showOnDevices: ["desktop", "mobile"], showOnce: true,
    bgColor: "#FFFFFF", textColor: "#3D1A0A", position: "center",
  })

  // Banner form
  const [showBannerForm, setShowBannerForm] = useState(false)
  const [bannerForm, setBannerForm] = useState({
    name: "", content: "", linkUrl: "", bgColor: "#C4622D",
    textColor: "#FFFFFF", isCloseable: true, position: "top",
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, bRes] = await Promise.all([
        fetch("/api/admin/popups"), fetch("/api/admin/banners"),
      ])
      if (pRes.ok) setPopups(await pRes.json())
      if (bRes.ok) setBanners(await bRes.json())
    } catch { /* */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const togglePopup = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/popups/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    fetchData()
  }

  const toggleBanner = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
    fetchData()
  }

  const savePopup = async () => {
    await fetch("/api/admin/popups", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(popupForm),
    })
    setShowPopupForm(false)
    fetchData()
  }

  const saveBanner = async () => {
    await fetch("/api/admin/banners", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bannerForm),
    })
    setShowBannerForm(false)
    fetchData()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const endpoint = tab === "popups" ? "popups" : "banners"
    await fetch(`/api/admin/${endpoint}/${deleteId}`, { method: "DELETE" })
    setDeleteId(null)
    fetchData()
  }

  const convRate = (imp: number, conv: number) =>
    imp > 0 ? ((conv / imp) * 100).toFixed(1) : "0"

  return (
    <div>
      <AdminHeader title="Pop-up & Banner" breadcrumb={["Pazarlama"]} />

      <div className="flex gap-1 mb-6 border-b">
        {(["popups", "banners"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
              tab === t ? "border-[#C4622D] text-[#C4622D]" : "border-transparent text-gray-500"
            }`}>
            {t === "popups" ? "Pop-up'lar" : "Banner'lar"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" size={24} /></div>
      ) : tab === "popups" ? (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowPopupForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#C4622D] text-white text-sm rounded-lg hover:bg-[#A34E1F]">
              <Plus size={16} /> Yeni Pop-up
            </button>
          </div>

          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">İsim</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tür</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Tetikleyici</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600"><Eye size={14} className="inline" /> Gösterim</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600"><MousePointerClick size={14} className="inline" /> Dönüşüm</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Oran</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Aktif</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">Sil</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {popups.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{p.type}</span></td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{p.trigger}</td>
                    <td className="px-4 py-3 text-right">{p.impressions}</td>
                    <td className="px-4 py-3 text-right">{p.conversions}</td>
                    <td className="px-4 py-3 text-right font-medium">{convRate(p.impressions, p.conversions)}%</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => togglePopup(p.id, p.isActive)}>
                        {p.isActive ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-gray-300" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setDeleteId(p.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
                {popups.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">Henüz pop-up yok</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowBannerForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#C4622D] text-white text-sm rounded-lg hover:bg-[#A34E1F]">
              <Plus size={16} /> Yeni Banner
            </button>
          </div>

          <div className="space-y-3">
            {banners.map((b) => (
              <div key={b.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
                <div className="w-40 h-10 rounded flex items-center justify-center text-xs" style={{ backgroundColor: b.bgColor, color: b.textColor }}>
                  {b.content.substring(0, 30)}...
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{b.name}</p>
                  <p className="text-xs text-gray-500">{b.position === "top" ? "Üst" : "Alt"} · {b.clicks} tıklama</p>
                </div>
                <button onClick={() => toggleBanner(b.id, b.isActive)}>
                  {b.isActive ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} className="text-gray-300" />}
                </button>
                <button onClick={() => setDeleteId(b.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
            {banners.length === 0 && (
              <div className="bg-white border rounded-xl p-8 text-center text-sm text-gray-400">Henüz banner yok</div>
            )}
          </div>
        </div>
      )}

      {/* Popup Create Form Modal */}
      {showPopupForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto space-y-4">
            <h3 className="text-lg font-bold">Yeni Pop-up</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><label className="text-xs text-gray-500">İsim</label><input value={popupForm.name} onChange={(e) => setPopupForm({ ...popupForm, name: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1" /></div>
              <div><label className="text-xs text-gray-500">Tür</label><select value={popupForm.type} onChange={(e) => setPopupForm({ ...popupForm, type: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1"><option value="EMAIL_CAPTURE">E-posta Yakalama</option><option value="DISCOUNT">İndirim</option><option value="ANNOUNCEMENT">Duyuru</option><option value="EXIT_INTENT">Çıkış Niyeti</option></select></div>
              <div><label className="text-xs text-gray-500">Tetikleyici</label><select value={popupForm.trigger} onChange={(e) => setPopupForm({ ...popupForm, trigger: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1"><option value="TIME_DELAY">Zaman Gecikmesi</option><option value="SCROLL_DEPTH">Scroll Derinliği</option><option value="EXIT_INTENT">Çıkış Niyeti</option><option value="PAGE_LOAD">Sayfa Yükleme</option></select></div>
              <div className="col-span-2"><label className="text-xs text-gray-500">Başlık</label><input value={popupForm.title} onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1" /></div>
              <div className="col-span-2"><label className="text-xs text-gray-500">Alt Başlık</label><input value={popupForm.subtitle} onChange={(e) => setPopupForm({ ...popupForm, subtitle: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1" /></div>
              <div><label className="text-xs text-gray-500">CTA Metin</label><input value={popupForm.ctaText} onChange={(e) => setPopupForm({ ...popupForm, ctaText: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1" /></div>
              <div><label className="text-xs text-gray-500">CTA URL</label><input value={popupForm.ctaUrl} onChange={(e) => setPopupForm({ ...popupForm, ctaUrl: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1" /></div>
              <div><label className="text-xs text-gray-500">Arkaplan Rengi</label><input type="color" value={popupForm.bgColor} onChange={(e) => setPopupForm({ ...popupForm, bgColor: e.target.value })} className="w-full h-8 mt-1" /></div>
              <div><label className="text-xs text-gray-500">Metin Rengi</label><input type="color" value={popupForm.textColor} onChange={(e) => setPopupForm({ ...popupForm, textColor: e.target.value })} className="w-full h-8 mt-1" /></div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowPopupForm(false)} className="px-4 py-2 text-sm border rounded-lg">İptal</button>
              <button onClick={savePopup} className="px-4 py-2 text-sm bg-[#C4622D] text-white rounded-lg hover:bg-[#A34E1F]">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Create Form Modal */}
      {showBannerForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 space-y-4">
            <h3 className="text-lg font-bold">Yeni Banner</h3>
            <div><label className="text-xs text-gray-500">İsim</label><input value={bannerForm.name} onChange={(e) => setBannerForm({ ...bannerForm, name: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1" /></div>
            <div><label className="text-xs text-gray-500">İçerik</label><input value={bannerForm.content} onChange={(e) => setBannerForm({ ...bannerForm, content: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1" placeholder="Ücretsiz kargo — 500₺ üzeri siparişlerde!" /></div>
            <div><label className="text-xs text-gray-500">Link URL</label><input value={bannerForm.linkUrl} onChange={(e) => setBannerForm({ ...bannerForm, linkUrl: e.target.value })} className="w-full border rounded px-3 py-1.5 text-sm mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-gray-500">Arkaplan</label><input type="color" value={bannerForm.bgColor} onChange={(e) => setBannerForm({ ...bannerForm, bgColor: e.target.value })} className="w-full h-8 mt-1" /></div>
              <div><label className="text-xs text-gray-500">Metin</label><input type="color" value={bannerForm.textColor} onChange={(e) => setBannerForm({ ...bannerForm, textColor: e.target.value })} className="w-full h-8 mt-1" /></div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowBannerForm(false)} className="px-4 py-2 text-sm border rounded-lg">İptal</button>
              <button onClick={saveBanner} className="px-4 py-2 text-sm bg-[#C4622D] text-white rounded-lg hover:bg-[#A34E1F]">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Silmek istediğinize emin misiniz?"
          message="Bu işlem geri alınamaz."
          confirmLabel="Sil"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}

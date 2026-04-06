"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Shield, Download, ExternalLink, Trash2, History,
  ToggleLeft, ToggleRight, AlertTriangle, Check, X, Loader2,
} from "lucide-react"

// --- Types ---

interface ConsentItem {
  key: string
  label: string
  type: string
  enabled: boolean
}

interface ConsentHistoryItem {
  id: string
  consentType: string
  granted: boolean
  source: string
  createdAt: string
}

// --- Helpers ---

const CONSENT_TYPE_LABELS: Record<string, string> = {
  EMAIL_MARKETING: "E-posta Pazarlama",
  SMS_MARKETING: "SMS Pazarlama",
  ANALYTICS_COOKIES: "Analitik Cerezler",
  MARKETING_COOKIES: "Pazarlama Cerezleri",
  PREFERENCE_COOKIES: "Tercih Cerezleri",
  DATA_PROCESSING: "Veri Isleme",
  SALES_CONTRACT: "Satis Sozlesmesi",
  TERMS_OF_SERVICE: "Kullanim Kosullari",
}

// Placeholder userId (replace with real auth when available)
function useUserId() {
  // TODO: Replace with real auth context
  return "demo-user-id"
}

export default function VeriHaklarimPage() {
  const userId = useUserId()
  const [consents, setConsents] = useState<ConsentItem[]>([
    { key: "email", label: "E-posta Pazarlama", type: "EMAIL_MARKETING", enabled: false },
    { key: "sms", label: "SMS Pazarlama", type: "SMS_MARKETING", enabled: false },
    { key: "analytics", label: "Analitik Cerezler", type: "ANALYTICS_COOKIES", enabled: false },
    { key: "marketing", label: "Pazarlama Cerezleri", type: "MARKETING_COOKIES", enabled: false },
  ])
  const [consentHistory, setConsentHistory] = useState<ConsentHistoryItem[]>([])
  const [exporting, setExporting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState("")
  const [deleteReason, setDeleteReason] = useState("")
  const [deletionLoading, setDeletionLoading] = useState(false)
  const [deletionSuccess, setDeletionSuccess] = useState(false)
  const [togglingKey, setTogglingKey] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const fetchConsentHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/legal/consent-records?page=1&limit=50`)
      if (res.ok) {
        const data = await res.json()
        setConsentHistory(data.records || [])
        // Update toggle states from latest records
        const latestByType: Record<string, boolean> = {}
        for (const r of data.records as ConsentHistoryItem[]) {
          if (!latestByType.hasOwnProperty(r.consentType)) {
            latestByType[r.consentType] = r.granted
          }
        }
        setConsents((prev) =>
          prev.map((c) => ({
            ...c,
            enabled: latestByType[c.type] ?? c.enabled,
          }))
        )
      }
    } catch {
      // silent fail
    }
  }, [])

  useEffect(() => {
    fetchConsentHistory()
  }, [fetchConsentHistory])

  async function handleToggle(item: ConsentItem) {
    setTogglingKey(item.key)
    try {
      if (item.enabled) {
        // Revoke
        await fetch("/api/consent/revoke", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, consentType: item.type }),
        })
      } else {
        // Grant via cookie consent
        const payload: Record<string, unknown> = { userId }
        if (item.type === "ANALYTICS_COOKIES") payload.analytics = true
        if (item.type === "MARKETING_COOKIES") payload.marketing = true
        if (item.type === "PREFERENCE_COOKIES") payload.preference = true
        if (item.type === "EMAIL_MARKETING" || item.type === "SMS_MARKETING") {
          // For marketing consents, use cookie route with appropriate type
          payload.analytics = false
          payload.marketing = false
          payload.preference = false
          // Actually these go through a direct recordConsent, use cookie route
          await fetch("/api/consent/cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        }
        if (
          item.type === "ANALYTICS_COOKIES" ||
          item.type === "MARKETING_COOKIES" ||
          item.type === "PREFERENCE_COOKIES"
        ) {
          await fetch("/api/consent/cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        }
      }
      setConsents((prev) =>
        prev.map((c) => (c.key === item.key ? { ...c, enabled: !c.enabled } : c))
      )
      setMessage({ text: "Onay tercihiniz guncellendi.", type: "success" })
    } catch {
      setMessage({ text: "Bir hata olustu.", type: "error" })
    } finally {
      setTogglingKey(null)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch("/api/users/data-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      if (!res.ok) throw new Error("Export basarisiz")
      const data = await res.json()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `verilerim-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setMessage({ text: "Verileriniz indirildi.", type: "success" })
    } catch {
      setMessage({ text: "Veri indirme sirasinda hata olustu.", type: "error" })
    } finally {
      setExporting(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  async function handleDeletionRequest() {
    if (!deleteEmail) return
    setDeletionLoading(true)
    try {
      const res = await fetch("/api/users/deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, confirmEmail: deleteEmail, reason: deleteReason }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Hata olustu")
      setDeletionSuccess(true)
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Bir hata olustu.",
        type: "error",
      })
    } finally {
      setDeletionLoading(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#3D1A0A] flex items-center gap-2">
          <Shield size={24} className="text-[#C4622D]" />
          Veri Haklarim (KVKK)
        </h1>
        <p className="text-sm text-[#6B3520] mt-1">
          6698 sayili KVKK kapsamindaki haklarinizi bu sayfadan kullanabilirsiniz.
        </p>
      </div>

      {/* Message Banner */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? <Check size={16} /> : <X size={16} />}
          {message.text}
        </div>
      )}

      {/* 1. Onay Yonetimi */}
      <section className="bg-white border border-[#E8D5A3] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#3D1A0A] mb-4">Onay Yonetimi</h2>
        <p className="text-sm text-gray-600 mb-4">
          Asagidaki onaylari dilediginiz zaman acip kapatabilirsiniz.
        </p>
        <div className="space-y-3">
          {consents.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 bg-[#FDF6EE] rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-[#3D1A0A]">{item.label}</p>
                <p className="text-xs text-gray-500">
                  {item.enabled ? "Aktif" : "Pasif"}
                </p>
              </div>
              <button
                onClick={() => handleToggle(item)}
                disabled={togglingKey === item.key}
                className="text-[#C4622D] hover:text-[#3D1A0A] transition-colors disabled:opacity-50"
              >
                {togglingKey === item.key ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : item.enabled ? (
                  <ToggleRight size={28} />
                ) : (
                  <ToggleLeft size={28} className="text-gray-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Verilerime Eris */}
      <section className="bg-white border border-[#E8D5A3] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#3D1A0A] mb-2">Verilerime Eris</h2>
        <p className="text-sm text-gray-600 mb-4">
          KVKK Madde 11 kapsaminda, sizinle iliskili tum kisisel verilerinizi JSON
          formatinda indirebilirsiniz. Bu dosya; profil bilgileri, siparisler,
          rezervasyonlar, yorumlar, sadakat islemleri ve onay gecmisinizi icerir.
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#C4622D] text-white rounded-lg text-sm font-medium hover:bg-[#A04E23] transition-colors disabled:opacity-50"
        >
          {exporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {exporting ? "Hazirlaniyor..." : "Verilerimi Indir"}
        </button>
      </section>

      {/* 3. Verilerimi Duzelt */}
      <section className="bg-white border border-[#E8D5A3] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#3D1A0A] mb-2">Verilerimi Duzelt</h2>
        <p className="text-sm text-gray-600 mb-4">
          Kisisel bilgilerinizi hesap sayfanizdan guncelleyebilirsiniz. Adiniz, e-posta
          adresiniz, telefon numaraniz ve adresleriniz uzerinde degisiklik yapabilirsiniz.
        </p>
        <a
          href="/hesabim"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#C4622D] text-[#C4622D] rounded-lg text-sm font-medium hover:bg-[#FDF6EE] transition-colors"
        >
          <ExternalLink size={16} />
          Profil Sayfasina Git
        </a>
      </section>

      {/* 4. Hesabimi Sil */}
      <section className="bg-white border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
          <AlertTriangle size={20} />
          Hesabimi Sil
        </h2>
        <div className="text-sm text-gray-600 space-y-2 mb-4">
          <p>Hesabinizi sildiginizde asagidaki islemler gerceklesir:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Profil bilgileriniz, adresleriniz ve istek listeniz kalici olarak silinir.</li>
            <li>Yapay zeka sohbet gecmisiniz silinir.</li>
            <li>Bildirim tercihleriniz silinir.</li>
            <li className="text-amber-700">
              Siparisleriniz VUK geregi anonimlestirilir (10 yil saklama zorunlulugu).
            </li>
            <li className="text-amber-700">
              Yorumlariniz anonim olarak kalir.
            </li>
          </ul>
          <p className="text-red-600 font-medium">
            Bu islem geri alinamaz.
          </p>
        </div>
        {deletionSuccess ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <Check size={16} className="inline mr-1" />
            Silme talebiniz basariyla alindi. 30 gun icinde islenecektir.
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
          >
            <Trash2 size={16} />
            Silme Talebinde Bulun
          </button>
        )}
      </section>

      {/* 5. Onay Gecmisi */}
      <section className="bg-white border border-[#E8D5A3] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#3D1A0A] mb-4 flex items-center gap-2">
          <History size={20} className="text-[#C4622D]" />
          Onay Gecmisi
        </h2>
        {consentHistory.length === 0 ? (
          <p className="text-sm text-gray-500">Henuz onay kaydi bulunmuyor.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8D5A3]">
                  <th className="text-left py-2 px-3 text-[#6B3520] font-medium">Tarih</th>
                  <th className="text-left py-2 px-3 text-[#6B3520] font-medium">Tur</th>
                  <th className="text-left py-2 px-3 text-[#6B3520] font-medium">Karar</th>
                  <th className="text-left py-2 px-3 text-[#6B3520] font-medium">Kaynak</th>
                </tr>
              </thead>
              <tbody>
                {consentHistory.slice(0, 20).map((h) => (
                  <tr key={h.id} className="border-b border-gray-100">
                    <td className="py-2 px-3 text-gray-600">
                      {new Date(h.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {CONSENT_TYPE_LABELS[h.consentType] || h.consentType}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          h.granted
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {h.granted ? "Kabul" : "Red"}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-500">{h.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-red-700 mb-3">
              Hesap Silme Onay
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Hesabinizi silmek istediginizi onaylamak icin e-posta adresinizi girin.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta Adresiniz
                </label>
                <input
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sebep (istege bagli)
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Hesabinizi neden silmek istiyorsunuz?"
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteEmail("")
                  setDeleteReason("")
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Vazgec
              </button>
              <button
                onClick={handleDeletionRequest}
                disabled={!deleteEmail || deletionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletionLoading && <Loader2 size={14} className="animate-spin" />}
                Hesabimi Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

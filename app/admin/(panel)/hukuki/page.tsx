"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Shield, FileText, CheckCircle, AlertCircle, ClipboardList,
  Trash2, ScrollText, Loader2, RefreshCw,
} from "lucide-react"

// --- Types ---

interface ConsentRecord {
  id: string
  consentType: string
  granted: boolean
  source: string
  createdAt: string
  user?: { id: string; email: string; name: string | null } | null
}

interface DeletionRequest {
  id: string
  userId: string
  status: string
  reason: string | null
  requestedAt: string
  processedAt: string | null
  processedBy: string | null
  user?: { id: string; email: string; name: string | null } | null
}

interface PolicyGroup {
  [policyType: string]: {
    id: string
    policyType: string
    version: string
    isActive: boolean
    summary: string | null
    publishedAt: string | null
    createdAt: string
  }[]
}

interface Stats {
  emailMarketingRate: number
  smsMarketingRate: number
  analyticsCookieRate: number
}

// --- Constants ---

const TABS = [
  { key: "politikalar", label: "Politikalar", icon: FileText },
  { key: "uyumluluk", label: "KVKK Uyumluluk", icon: Shield },
  { key: "onaylar", label: "Onay Kayitlari", icon: ClipboardList },
  { key: "silme", label: "Veri Silme Talepleri", icon: Trash2 },
  { key: "sozlesmeler", label: "Sozlesmeler", icon: ScrollText },
] as const

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

const POLICY_TYPE_LABELS: Record<string, string> = {
  privacy: "Gizlilik Politikasi",
  kvkk: "KVKK Aydinlatma Metni",
  cookies: "Cerez Politikasi",
  terms: "Kullanim Kosullari",
  cancellation: "Iptal ve Iade Politikasi",
  delivery: "Teslimat Politikasi",
  salesContract: "Mesafeli Satis Sozlesmesi",
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Beklemede",
  IN_PROGRESS: "Isleniyor",
  COMPLETED: "Tamamlandi",
  REJECTED: "Reddedildi",
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
}

const COMPLIANCE_ITEMS = [
  { label: "Aydinlatma Metni", key: "aydinlatma", status: "green" },
  { label: "Acik Riza Mekanizmasi", key: "riza", status: "green" },
  { label: "Veri Tasinabilirlik (Data Export)", key: "tasinabilirlik", status: "green" },
  { label: "Hesap Silme (Unutulma Hakki)", key: "silme", status: "green" },
  { label: "Cerez Onay Yonetimi", key: "cerez", status: "green" },
  { label: "Saklama Sureleri Tanimli", key: "saklama", status: "yellow" },
  { label: "Ucuncu Taraf Aktarimlari Belgelendi", key: "ucuncu_taraf", status: "yellow" },
  { label: "Onay Kaydi Sistemi", key: "onay_kaydi", status: "green" },
]

export default function HukukiPage() {
  const [activeTab, setActiveTab] = useState<string>("politikalar")
  const [loading, setLoading] = useState(false)

  // Tab data states
  const [policies, setPolicies] = useState<PolicyGroup>({})
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([])
  const [consentStats, setConsentStats] = useState<Stats>({
    emailMarketingRate: 0,
    smsMarketingRate: 0,
    analyticsCookieRate: 0,
  })
  const [consentTotal, setConsentTotal] = useState(0)
  const [consentPage, setConsentPage] = useState(1)
  const [deletionRequests, setDeletionRequests] = useState<DeletionRequest[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // --- Fetch functions ---

  const fetchPolicies = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/legal/policies")
      if (res.ok) {
        const data = await res.json()
        setPolicies(data.policies || {})
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchConsentRecords = useCallback(async (page: number) => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/legal/consent-records?page=${page}&limit=20`
      )
      if (res.ok) {
        const data = await res.json()
        setConsentRecords(data.records || [])
        setConsentTotal(data.total || 0)
        setConsentStats(
          data.stats || { emailMarketingRate: 0, smsMarketingRate: 0, analyticsCookieRate: 0 }
        )
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDeletionRequests = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/legal/deletion-requests")
      if (res.ok) {
        const data = await res.json()
        setDeletionRequests(data.requests || [])
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === "politikalar") fetchPolicies()
    if (activeTab === "onaylar") fetchConsentRecords(consentPage)
    if (activeTab === "silme") fetchDeletionRequests()
  }, [activeTab, consentPage, fetchPolicies, fetchConsentRecords, fetchDeletionRequests])

  async function handleDeletionAction(
    id: string,
    status: "IN_PROGRESS" | "COMPLETED" | "REJECTED"
  ) {
    setActionLoading(id)
    try {
      await fetch("/api/admin/legal/deletion-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, processedBy: "admin" }),
      })
      fetchDeletionRequests()
    } catch {
      // silent
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#3D1A0A] flex items-center gap-2">
          <Shield size={24} className="text-[#C4622D]" />
          Hukuki Yonetim
        </h1>
        <p className="text-sm text-[#6B3520] mt-1">
          KVKK uyumluluk, onay kayitlari, veri silme talepleri ve politika yonetimi
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-[#FDF6EE] p-1 rounded-lg border border-[#E8D5A3]">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-[#3D1A0A] shadow-sm"
                  : "text-[#6B3520] hover:bg-white/50"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-[#C4622D]" />
        </div>
      )}

      {/* Tab Content */}
      {!loading && activeTab === "politikalar" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Aktif politika versiyonlari asagida listelenmiştir. Yeni versiyon eklemek
            icin API uzerinden POST istegi gonderin.
          </p>
          {Object.keys(POLICY_TYPE_LABELS).map((type) => {
            const versions = policies[type] || []
            const active = versions.find((v) => v.isActive)
            return (
              <div
                key={type}
                className="bg-white border border-[#E8D5A3] rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[#3D1A0A]">
                    {POLICY_TYPE_LABELS[type]}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {active
                      ? `Aktif Versiyon: ${active.version} - ${new Date(
                          active.publishedAt || active.createdAt
                        ).toLocaleDateString("tr-TR")}`
                      : "Henuz aktif versiyon yok"}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {active ? "Aktif" : "Tanimlanmadi"}
                </span>
              </div>
            )
          })}
          <p className="text-xs text-gray-400 italic">
            Politika icerik duzenlemesi icin kod tabanindaki ilgili dosyalar guncellenmelidir.
          </p>
        </div>
      )}

      {!loading && activeTab === "uyumluluk" && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            KVKK uyumluluk kontrol listesi. Yesil maddeler tamamlanan, sari maddeler
            dikkat gerektiren alanlardir.
          </p>
          <div className="grid gap-3">
            {COMPLIANCE_ITEMS.map((item) => (
              <div
                key={item.key}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  item.status === "green"
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                {item.status === "green" ? (
                  <CheckCircle size={20} className="text-green-600 shrink-0" />
                ) : (
                  <AlertCircle size={20} className="text-yellow-600 shrink-0" />
                )}
                <span
                  className={`text-sm font-medium ${
                    item.status === "green" ? "text-green-800" : "text-yellow-800"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && activeTab === "onaylar" && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "E-posta Pazarlama Onayi",
                value: `%${consentStats.emailMarketingRate}`,
              },
              {
                label: "SMS Pazarlama Onayi",
                value: `%${consentStats.smsMarketingRate}`,
              },
              {
                label: "Analitik Cerez Onayi",
                value: `%${consentStats.analyticsCookieRate}`,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-[#E8D5A3] rounded-lg p-4 text-center"
              >
                <p className="text-2xl font-bold text-[#C4622D]">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white border border-[#E8D5A3] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8D5A3] bg-[#FDF6EE]">
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Tarih</th>
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Kullanici</th>
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Tur</th>
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Karar</th>
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Kaynak</th>
                </tr>
              </thead>
              <tbody>
                {consentRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Henuz onay kaydi bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  consentRecords.map((r) => (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-[#FDF6EE]/50">
                      <td className="py-2.5 px-4 text-gray-600">
                        {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="py-2.5 px-4 text-gray-600">
                        {r.user?.email || "-"}
                      </td>
                      <td className="py-2.5 px-4 text-gray-600">
                        {CONSENT_TYPE_LABELS[r.consentType] || r.consentType}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            r.granted
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {r.granted ? "Kabul" : "Red"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-gray-500">{r.source}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {consentTotal > 20 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Toplam {consentTotal} kayit
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConsentPage((p) => Math.max(1, p - 1))}
                  disabled={consentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                >
                  Onceki
                </button>
                <button
                  onClick={() => setConsentPage((p) => p + 1)}
                  disabled={consentPage * 20 >= consentTotal}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === "silme" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Musterilerden gelen veri silme talepleri
            </p>
            <button
              onClick={fetchDeletionRequests}
              className="inline-flex items-center gap-1 text-sm text-[#C4622D] hover:text-[#3D1A0A]"
            >
              <RefreshCw size={14} />
              Yenile
            </button>
          </div>
          <div className="bg-white border border-[#E8D5A3] rounded-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8D5A3] bg-[#FDF6EE]">
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Tarih</th>
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Kullanici</th>
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Durum</th>
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Sebep</th>
                  <th className="text-left py-3 px-4 text-[#6B3520] font-medium">Islemler</th>
                </tr>
              </thead>
              <tbody>
                {deletionRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">
                      Henuz silme talebi bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  deletionRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-gray-100 hover:bg-[#FDF6EE]/50"
                    >
                      <td className="py-2.5 px-4 text-gray-600">
                        {new Date(req.requestedAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="py-2.5 px-4 text-gray-600">
                        {req.user?.email || req.userId}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            STATUS_COLORS[req.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {STATUS_LABELS[req.status] || req.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-gray-500 max-w-[200px] truncate">
                        {req.reason || "-"}
                      </td>
                      <td className="py-2.5 px-4">
                        {req.status === "PENDING" && (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() =>
                                handleDeletionAction(req.id, "IN_PROGRESS")
                              }
                              disabled={actionLoading === req.id}
                              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 disabled:opacity-50"
                            >
                              {actionLoading === req.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                "Isleme Al"
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleDeletionAction(req.id, "REJECTED")
                              }
                              disabled={actionLoading === req.id}
                              className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50"
                            >
                              Reddet
                            </button>
                          </div>
                        )}
                        {req.status === "IN_PROGRESS" && (
                          <button
                            onClick={() =>
                              handleDeletionAction(req.id, "COMPLETED")
                            }
                            disabled={actionLoading === req.id}
                            className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 disabled:opacity-50"
                          >
                            {actionLoading === req.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              "Tamamla"
                            )}
                          </button>
                        )}
                        {(req.status === "COMPLETED" || req.status === "REJECTED") && (
                          <span className="text-xs text-gray-400">
                            {req.processedAt
                              ? new Date(req.processedAt).toLocaleDateString("tr-TR")
                              : "-"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && activeTab === "sozlesmeler" && (
        <div className="bg-white border border-[#E8D5A3] rounded-lg p-6 text-center">
          <ScrollText size={40} className="mx-auto text-[#E8D5A3] mb-3" />
          <h3 className="text-lg font-medium text-[#3D1A0A] mb-2">
            Mesafeli Satis Sozlesmeleri
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Satis sozlesmeleri her siparis olusturuldugunda otomatik olarak uretilir ve
            siparis detaylarina eklenir. Sozlesme icerigi{" "}
            <code className="text-xs bg-[#FDF6EE] px-1 py-0.5 rounded">/api/orders/[id]/contract</code>{" "}
            endpoint&apos;i uzerinden goruntulenebilir.
          </p>
        </div>
      )}
    </div>
  )
}

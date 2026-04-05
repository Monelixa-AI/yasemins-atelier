"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Loader2, Send, Mail, Clock, ToggleLeft, ToggleRight } from "lucide-react"

interface EmailLogRow {
  id: string
  to: string
  subject: string
  status: string
  createdAt: string
}

const AUTOMATIONS = [
  { key: "welcome", label: "Hoş geldin e-postası", desc: "Kayıt sonrası otomatik" },
  { key: "order_confirm", label: "Sipariş onayı", desc: "Ödeme sonrası otomatik" },
  { key: "order_status", label: "Teslimat bildirimi", desc: "Durum değişince otomatik" },
  { key: "booking_confirm", label: "Booking onayı", desc: "Admin onaylayınca" },
  { key: "booking_reminder", label: "Booking hatırlatma", desc: "24 saat önce (cron)" },
  { key: "birthday", label: "Doğum günü", desc: "Her sabah kontrol (cron)" },
  { key: "winback", label: "Sizi özledik", desc: "90 gün sonra (cron)" },
  { key: "loyalty_levelup", label: "Seviye atlama", desc: "Puan eşiği geçince" },
]

export default function EmailPage() {
  const [tab, setTab] = useState<"campaigns" | "automations" | "history">("campaigns")
  const [logs, setLogs] = useState<EmailLogRow[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [automationStates, setAutomationStates] = useState<Record<string, boolean>>(
    Object.fromEntries(AUTOMATIONS.map((a) => [a.key, true]))
  )

  // Campaign send
  const [sending, setSending] = useState(false)
  const [campaignForm, setCampaignForm] = useState({
    subject: "",
    headline: "",
    body: "",
    ctaText: "",
    ctaUrl: "",
  })
  const [sendResult, setSendResult] = useState<string | null>(null)

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true)
    try {
      // EmailLog'lar doğrudan prisma'dan gelmeli, basit endpoint kullanacağız
      // Şimdilik placeholder
      setLogs([])
    } catch { /* ignore */ }
    finally { setLogsLoading(false) }
  }, [])

  useEffect(() => {
    if (tab === "history") fetchLogs()
  }, [tab, fetchLogs])

  const handleSendCampaign = async () => {
    if (!campaignForm.subject || !campaignForm.headline || !campaignForm.body) return
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch("/api/admin/email/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignForm),
      })
      const data = await res.json()
      if (res.ok) {
        setSendResult(`${data.sent} kişiye gönderildi!`)
        setCampaignForm({ subject: "", headline: "", body: "", ctaText: "", ctaUrl: "" })
      } else {
        setSendResult(data.error || "Gönderim hatası")
      }
    } catch {
      setSendResult("Bağlantı hatası")
    } finally {
      setSending(false)
    }
  }

  const toggleAutomation = (key: string) => {
    setAutomationStates((prev) => ({ ...prev, [key]: !prev[key] }))
    // In production, save to Settings table
  }

  return (
    <div>
      <AdminHeader title="E-posta Yönetimi" breadcrumb={["Pazarlama", "E-posta"]} />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {[
          { key: "campaigns" as const, label: "Kampanya Gönder", icon: Send },
          { key: "automations" as const, label: "Otomasyonlar", icon: Clock },
          { key: "history" as const, label: "Gönderim Geçmişi", icon: Mail },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key
                ? "border-[#C4622D] text-[#C4622D]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Campaigns Tab */}
      {tab === "campaigns" && (
        <div className="max-w-2xl space-y-4">
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h3 className="font-medium text-gray-900">Yeni Bülten Kampanyası</h3>

            <div>
              <label className="text-xs text-gray-500">Konu Satırı *</label>
              <input
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                placeholder="Mevsimin lezzetleri sizin için hazır!"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Başlık *</label>
              <input
                value={campaignForm.headline}
                onChange={(e) => setCampaignForm({ ...campaignForm, headline: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                placeholder="Bu Haftanın Özel Menüsü"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">İçerik *</label>
              <textarea
                value={campaignForm.body}
                onChange={(e) => setCampaignForm({ ...campaignForm, body: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm mt-1 resize-none"
                rows={5}
                placeholder="Kampanya içeriğini yazın..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">CTA Buton Metni</label>
                <input
                  value={campaignForm.ctaText}
                  onChange={(e) => setCampaignForm({ ...campaignForm, ctaText: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                  placeholder="Hemen Sipariş Ver"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">CTA Link</label>
                <input
                  value={campaignForm.ctaUrl}
                  onChange={(e) => setCampaignForm({ ...campaignForm, ctaUrl: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm mt-1"
                  placeholder="https://yaseminsatelier.com/menu"
                />
              </div>
            </div>

            {sendResult && (
              <p className={`text-sm ${sendResult.includes("hata") ? "text-red-600" : "text-green-600"}`}>
                {sendResult}
              </p>
            )}

            <button
              onClick={handleSendCampaign}
              disabled={sending || !campaignForm.subject || !campaignForm.body}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#C4622D] text-white text-sm rounded-lg hover:bg-[#A34E1F] disabled:opacity-50"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? "Gönderiliyor..." : "Tüm Abonelere Gönder"}
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-700">
              Resend free plan: 3.000 e-posta/ay, 100/gün limit.
              Domain doğrulaması için DNS kayıtlarını (SPF, DKIM) ekleyin.
            </p>
          </div>
        </div>
      )}

      {/* Automations Tab */}
      {tab === "automations" && (
        <div className="max-w-2xl space-y-3">
          {AUTOMATIONS.map((a) => {
            const isOn = automationStates[a.key]
            return (
              <div
                key={a.key}
                className="bg-white border rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.label}</p>
                  <p className="text-xs text-gray-500">{a.desc}</p>
                </div>
                <button onClick={() => toggleAutomation(a.key)}>
                  {isOn ? (
                    <ToggleRight size={32} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={32} className="text-gray-300" />
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <div>
          {logsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-gray-400" size={24} />
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-white border rounded-xl p-12 text-center">
              <Mail size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">Henüz gönderim kaydı yok.</p>
              <p className="text-xs text-gray-400 mt-1">
                E-postalar gönderildiğinde burada görünecek.
              </p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Tarih</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Alıcı</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Konu</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(log.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{log.to}</td>
                      <td className="px-4 py-3">{log.subject}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          log.status === "sent" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {log.status === "sent" ? "Gönderildi" : "Hata"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Loader2, Send, MessageSquare, Clock, ToggleLeft, ToggleRight } from "lucide-react"

const SMS_AUTOMATIONS = [
  { key: "order_confirmed", label: "Sipariş alındı SMS", desc: "Ödeme sonrası otomatik" },
  { key: "order_delivery", label: "Sipariş yolda SMS", desc: "Kargoya verilince" },
  { key: "order_delivered", label: "Teslim edildi SMS", desc: "Teslim sonrası" },
  { key: "booking_approved", label: "Booking onay SMS", desc: "Admin onaylayınca" },
  { key: "booking_reminder", label: "Booking hatırlatma SMS", desc: "24 saat önce (cron)" },
]

export default function SMSPage() {
  const [tab, setTab] = useState<"send" | "automations" | "history">("send")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)
  const [automationStates, setAutomationStates] = useState<Record<string, boolean>>(
    Object.fromEntries(SMS_AUTOMATIONS.map((a) => [a.key, true]))
  )

  const charCount = message.length
  const isOverLimit = charCount > 160

  const handleSend = async () => {
    if (!message.trim() || isOverLimit) return
    setSending(true)
    setSendResult(null)
    try {
      const res = await fetch("/api/admin/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      })
      const data = await res.json()
      if (res.ok) {
        setSendResult(`${data.sent} kişiye gönderildi, ${data.failed} başarısız`)
        setMessage("")
      } else {
        setSendResult(data.error || "Gönderim hatası")
      }
    } catch {
      setSendResult("Bağlantı hatası")
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <AdminHeader title="SMS Yönetimi" breadcrumb={["Pazarlama", "SMS"]} />

      <div className="flex gap-1 mb-6 border-b">
        {[
          { key: "send" as const, label: "Toplu SMS", icon: Send },
          { key: "automations" as const, label: "Otomasyonlar", icon: Clock },
          { key: "history" as const, label: "Gönderim Geçmişi", icon: MessageSquare },
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

      {tab === "send" && (
        <div className="max-w-lg space-y-4">
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h3 className="font-medium text-gray-900">Toplu SMS Gönder</h3>
            <p className="text-xs text-gray-500">
              SMS onayı veren tüm müşterilere gönderilir.
            </p>

            <div>
              <label className="text-xs text-gray-500">Mesaj</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 text-sm mt-1 resize-none ${
                  isOverLimit ? "border-red-400" : ""
                }`}
                rows={4}
                placeholder="SMS metnini yazın..."
              />
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${isOverLimit ? "text-red-500 font-medium" : "text-gray-400"}`}>
                  {charCount}/160 karakter
                </span>
                {isOverLimit && (
                  <span className="text-xs text-red-500">Limit aşıldı!</span>
                )}
              </div>
            </div>

            {sendResult && (
              <p className={`text-sm ${sendResult.includes("hata") ? "text-red-600" : "text-green-600"}`}>
                {sendResult}
              </p>
            )}

            <button
              onClick={handleSend}
              disabled={sending || !message.trim() || isOverLimit}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#C4622D] text-white text-sm rounded-lg hover:bg-[#A34E1F] disabled:opacity-50"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? "Gönderiliyor..." : "SMS Gönder"}
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs text-amber-700">
              Netgsm sender başlığı &quot;YasAtelier&quot; onaylatılmalıdır (1-2 iş günü).
              SMS ücretleri Netgsm hesabından düşülür.
            </p>
          </div>
        </div>
      )}

      {tab === "automations" && (
        <div className="max-w-lg space-y-3">
          {SMS_AUTOMATIONS.map((a) => {
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
                <button onClick={() => setAutomationStates((p) => ({ ...p, [a.key]: !p[a.key] }))}>
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

      {tab === "history" && (
        <div className="bg-white border rounded-xl p-12 text-center">
          <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">Henüz SMS kaydı yok.</p>
          <p className="text-xs text-gray-400 mt-1">
            SMS gönderildiğinde burada görünecek.
          </p>
        </div>
      )}
    </div>
  )
}

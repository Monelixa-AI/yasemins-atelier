"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  Settings, Loader2, Save, Info, Eye, EyeOff,
} from "lucide-react"

type TabKey = "genel" | "eticaret" | "odeme" | "guvenlik"

const TABS: { key: TabKey; label: string }[] = [
  { key: "genel", label: "Genel" },
  { key: "eticaret", label: "E-ticaret" },
  { key: "odeme", label: "Odeme" },
  { key: "guvenlik", label: "Guvenlik" },
]

interface GeneralSettings {
  siteName: string
  tagline: string
  contactEmail: string
  phone: string
  whatsapp: string
  instagram: string
}

interface EcommerceSettings {
  minOrderAmount: string
  foodTaxRate: string
  serviceTaxRate: string
  cashFee: string
  loyaltyRate: string
}

interface PaymentSettings {
  stripePublicKey: string
  stripeSecretKey: string
  iyzicoApiKey: string
  iyzicoSecretKey: string
  testMode: boolean
}

export default function AyarlarPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("genel")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Forms
  const [general, setGeneral] = useState<GeneralSettings>({
    siteName: "", tagline: "", contactEmail: "", phone: "", whatsapp: "", instagram: "",
  })
  const [ecommerce, setEcommerce] = useState<EcommerceSettings>({
    minOrderAmount: "", foodTaxRate: "", serviceTaxRate: "", cashFee: "", loyaltyRate: "",
  })
  const [payment, setPayment] = useState<PaymentSettings>({
    stripePublicKey: "", stripeSecretKey: "", iyzicoApiKey: "", iyzicoSecretKey: "", testMode: true,
  })

  // Masked fields
  const [showStripeSecret, setShowStripeSecret] = useState(false)
  const [showIyzicoSecret, setShowIyzicoSecret] = useState(false)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings")
      if (!res.ok) throw new Error()
      const data = await res.json()
      const settings = Array.isArray(data) ? data : []

      const getValue = (key: string) => {
        const s = settings.find((x: { key: string; value: unknown }) => x.key === key)
        return s?.value ?? null
      }

      const gen = getValue("general")
      if (gen && typeof gen === "object") {
        const g = gen as Record<string, string>
        setGeneral({
          siteName: g.siteName || "",
          tagline: g.tagline || "",
          contactEmail: g.contactEmail || "",
          phone: g.phone || "",
          whatsapp: g.whatsapp || "",
          instagram: g.instagram || "",
        })
      }

      const eco = getValue("ecommerce")
      if (eco && typeof eco === "object") {
        const e = eco as Record<string, string>
        setEcommerce({
          minOrderAmount: e.minOrderAmount || "",
          foodTaxRate: e.foodTaxRate || "",
          serviceTaxRate: e.serviceTaxRate || "",
          cashFee: e.cashFee || "",
          loyaltyRate: e.loyaltyRate || "",
        })
      }

      const pay = getValue("payment")
      if (pay && typeof pay === "object") {
        const p = pay as Record<string, unknown>
        setPayment({
          stripePublicKey: (p.stripePublicKey as string) || "",
          stripeSecretKey: (p.stripeSecretKey as string) || "",
          iyzicoApiKey: (p.iyzicoApiKey as string) || "",
          iyzicoSecretKey: (p.iyzicoSecretKey as string) || "",
          testMode: p.testMode !== false,
        })
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  async function handleSave(key: string, value: unknown) {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })

      if (res.ok) {
        alert("Ayarlar kaydedildi")
      } else {
        alert("Kaydetme hatasi")
      }
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setSaving(false)
    }
  }

  function maskKey(key: string): string {
    if (!key || key.length < 8) return key
    return key.substring(0, 4) + "****" + key.substring(key.length - 4)
  }

  if (loading) {
    return (
      <div>
        <AdminHeader title="Ayarlar" breadcrumb={["Sistem", "Ayarlar"]} />
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminHeader title="Ayarlar" breadcrumb={["Sistem", "Ayarlar"]} />

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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

      {/* Genel Tab */}
      {activeTab === "genel" && (
        <div className="max-w-lg">
          <div className="bg-white border rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Site Adi</label>
              <input
                type="text"
                value={general.siteName}
                onChange={(e) => setGeneral((p) => ({ ...p, siteName: e.target.value }))}
                placeholder="Yasemin's Atelier"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Tagline</label>
              <input
                type="text"
                value={general.tagline}
                onChange={(e) => setGeneral((p) => ({ ...p, tagline: e.target.value }))}
                placeholder="El yapimi lezzetler..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Iletisim E-postasi</label>
              <input
                type="email"
                value={general.contactEmail}
                onChange={(e) => setGeneral((p) => ({ ...p, contactEmail: e.target.value }))}
                placeholder="info@yaseminsatelier.com"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Telefon</label>
              <input
                type="tel"
                value={general.phone}
                onChange={(e) => setGeneral((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+90 5xx xxx xx xx"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">WhatsApp</label>
              <input
                type="tel"
                value={general.whatsapp}
                onChange={(e) => setGeneral((p) => ({ ...p, whatsapp: e.target.value }))}
                placeholder="+90 5xx xxx xx xx"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Instagram</label>
              <input
                type="text"
                value={general.instagram}
                onChange={(e) => setGeneral((p) => ({ ...p, instagram: e.target.value }))}
                placeholder="@yaseminsatelier"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>
            <button
              onClick={() => handleSave("general", general)}
              disabled={saving}
              className="flex items-center gap-2 bg-[#C4622D] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* E-ticaret Tab */}
      {activeTab === "eticaret" && (
        <div className="max-w-lg">
          <div className="bg-white border rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Minimum Siparis Tutari (&#8378;)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={ecommerce.minOrderAmount}
                onChange={(e) => setEcommerce((p) => ({ ...p, minOrderAmount: e.target.value }))}
                placeholder="orn. 100"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Gida KDV Orani (%)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={ecommerce.foodTaxRate}
                  onChange={(e) => setEcommerce((p) => ({ ...p, foodTaxRate: e.target.value }))}
                  placeholder="orn. 10"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Hizmet KDV Orani (%)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={ecommerce.serviceTaxRate}
                  onChange={(e) => setEcommerce((p) => ({ ...p, serviceTaxRate: e.target.value }))}
                  placeholder="orn. 20"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Kapida Odeme Ucreti (&#8378;)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={ecommerce.cashFee}
                onChange={(e) => setEcommerce((p) => ({ ...p, cashFee: e.target.value }))}
                placeholder="orn. 5"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Sadakat Puan Orani (&#8378; basina puan)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={ecommerce.loyaltyRate}
                onChange={(e) => setEcommerce((p) => ({ ...p, loyaltyRate: e.target.value }))}
                placeholder="orn. 0.05"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>

            <button
              onClick={() => handleSave("ecommerce", ecommerce)}
              disabled={saving}
              className="flex items-center gap-2 bg-[#C4622D] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Kaydet
            </button>
          </div>
        </div>
      )}

      {/* Odeme Tab */}
      {activeTab === "odeme" && (
        <div className="max-w-lg space-y-6">
          <div className="bg-white border rounded-xl p-6 space-y-5">
            {/* Stripe */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Stripe</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Public Key
                  </label>
                  <input
                    type="text"
                    value={maskKey(payment.stripePublicKey)}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showStripeSecret ? "text" : "password"}
                      value={
                        showStripeSecret
                          ? payment.stripeSecretKey
                          : maskKey(payment.stripeSecretKey)
                      }
                      readOnly
                      className="w-full border rounded-lg px-3 py-2 pr-10 text-sm bg-gray-50 text-gray-500 font-mono"
                    />
                    <button
                      onClick={() => setShowStripeSecret(!showStripeSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showStripeSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* iyzico */}
            <div className="border-t pt-5">
              <h4 className="text-sm font-medium text-gray-900 mb-3">iyzico</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={maskKey(payment.iyzicoApiKey)}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showIyzicoSecret ? "text" : "password"}
                      value={
                        showIyzicoSecret
                          ? payment.iyzicoSecretKey
                          : maskKey(payment.iyzicoSecretKey)
                      }
                      readOnly
                      className="w-full border rounded-lg px-3 py-2 pr-10 text-sm bg-gray-50 text-gray-500 font-mono"
                    />
                    <button
                      onClick={() => setShowIyzicoSecret(!showIyzicoSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showIyzicoSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Mode */}
            <div className="border-t pt-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Test Modu</p>
                <p className="text-xs text-gray-400">
                  Aktifken gercek odeme alinmaz
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  payment.testMode
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {payment.testMode ? "Test" : "Canli"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <Info size={16} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700">
              Anahtarlar .env dosyasindan yonetilir. Bu sayfada sadece goruntuleme yapilabilir.
            </p>
          </div>
        </div>
      )}

      {/* Guvenlik Tab */}
      {activeTab === "guvenlik" && (
        <div className="max-w-lg space-y-6">
          {/* Admin Users */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={16} className="text-[#B8975C]" />
              <h3 className="text-sm font-medium text-gray-700">Admin Kullanicilari</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-sm text-gray-400">Admin yonetimi yakinda eklenecek.</p>
            </div>
          </div>

          {/* Audit Log */}
          <div className="bg-white border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings size={16} className="text-[#B8975C]" />
              <h3 className="text-sm font-medium text-gray-700">Denetim Gunlugu</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-sm text-gray-400">Denetim gunlugu yakinda eklenecek.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

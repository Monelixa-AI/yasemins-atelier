"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  Truck, Loader2, Info, ToggleLeft, ToggleRight, Save,
} from "lucide-react"

type TabKey = "zones" | "shipping"

interface DeliveryZone {
  id: string
  name: string
  districts: string[]
  fee: string | number
  freeThreshold: string | number | null
  isActive: boolean
}

interface ShippingForm {
  freeShippingThreshold: string
  standardPrice: string
  expressPrice: string
}

export default function TeslimatPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("zones")
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    freeShippingThreshold: "",
    standardPrice: "",
    expressPrice: "",
  })
  const [savingShipping, setSavingShipping] = useState(false)

  const fetchZones = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/delivery-zones")
      if (res.ok) {
        const data = await res.json()
        setZones(Array.isArray(data) ? data : data.zones || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchShippingSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/settings?key=shipping")
      if (res.ok) {
        const data = await res.json()
        if (data.value) {
          const val = typeof data.value === "string" ? JSON.parse(data.value) : data.value
          setShippingForm({
            freeShippingThreshold: val.freeShippingThreshold || "",
            standardPrice: val.standardPrice || "",
            expressPrice: val.expressPrice || "",
          })
        }
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    fetchZones()
    fetchShippingSettings()
  }, [fetchZones, fetchShippingSettings])

  async function handleSaveShipping() {
    setSavingShipping(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "shipping",
          value: {
            freeShippingThreshold: shippingForm.freeShippingThreshold
              ? parseFloat(shippingForm.freeShippingThreshold)
              : null,
            standardPrice: shippingForm.standardPrice
              ? parseFloat(shippingForm.standardPrice)
              : null,
            expressPrice: shippingForm.expressPrice
              ? parseFloat(shippingForm.expressPrice)
              : null,
          },
        }),
      })

      if (res.ok) {
        alert("Kargo ayarlari kaydedildi")
      } else {
        alert("Kaydetme hatasi")
      }
    } catch {
      alert("Baglanti hatasi")
    } finally {
      setSavingShipping(false)
    }
  }

  const TABS: { key: TabKey; label: string }[] = [
    { key: "zones", label: "Bolgeler" },
    { key: "shipping", label: "Kargo Ayarlari" },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader title="Teslimat Yonetimi" breadcrumb={["Sistem", "Teslimat"]} />

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

      {/* Zones Tab */}
      {activeTab === "zones" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <Info size={16} className="text-blue-500 shrink-0" />
            <p className="text-sm text-blue-700">
              Bolge duzenlemesi yakinda eklenecek.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : zones.length === 0 ? (
            <div className="bg-white border rounded-xl p-12 text-center">
              <Truck size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-400">Henuz teslimat bolgesi tanimlanmadi</p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Bolge</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Ilceler</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Ucret</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Ucretsiz Esik</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">Aktif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {zones.map((zone) => (
                      <tr key={zone.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {zone.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-600 truncate max-w-[200px] block">
                            {zone.districts.join(", ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                          {parseFloat(String(zone.fee)).toLocaleString("tr-TR")}&#8378;
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          {zone.freeThreshold
                            ? parseFloat(String(zone.freeThreshold)).toLocaleString("tr-TR") + "\u20BA"
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {zone.isActive ? (
                            <ToggleRight size={24} className="text-[#C4622D] inline-block" />
                          ) : (
                            <ToggleLeft size={24} className="text-gray-400 inline-block" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shipping Settings Tab */}
      {activeTab === "shipping" && (
        <div className="max-w-lg space-y-6">
          <div className="bg-white border rounded-xl p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Ucretsiz Kargo Esigi (&#8378;)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={shippingForm.freeShippingThreshold}
                onChange={(e) =>
                  setShippingForm((p) => ({ ...p, freeShippingThreshold: e.target.value }))
                }
                placeholder="orn. 300"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Standart Kargo Ucreti (&#8378;)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={shippingForm.standardPrice}
                onChange={(e) =>
                  setShippingForm((p) => ({ ...p, standardPrice: e.target.value }))
                }
                placeholder="orn. 29.90"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Express Kargo Ucreti (&#8378;)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={shippingForm.expressPrice}
                onChange={(e) =>
                  setShippingForm((p) => ({ ...p, expressPrice: e.target.value }))
                }
                placeholder="orn. 59.90"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D] outline-none"
              />
            </div>

            <button
              onClick={handleSaveShipping}
              disabled={savingShipping}
              className="flex items-center gap-2 bg-[#C4622D] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#A34E1F] disabled:opacity-50 transition-colors"
            >
              {savingShipping ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Kaydet
            </button>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <Info size={16} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700">
              Ayarlar Setting tablosuna kaydedilecek.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

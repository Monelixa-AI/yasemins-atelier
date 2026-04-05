"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import {
  BarChart3, Download, ShoppingBag, Package, Users, AlertTriangle, Info,
} from "lucide-react"

export default function RaporlarPage() {
  // Sales report
  const [salesFrom, setSalesFrom] = useState("")
  const [salesTo, setSalesTo] = useState("")

  function handleSalesCSV() {
    alert("CSV indirme henuz aktif degil. Detayli raporlar Faz 14'te eklenecek.")
  }

  function handleProductCSV() {
    alert("Urun raporu henuz aktif degil. Detayli raporlar Faz 14'te eklenecek.")
  }

  function handleCustomerCSV() {
    alert("Musteri raporu henuz aktif degil. Detayli raporlar Faz 14'te eklenecek.")
  }

  function handleStockCSV() {
    alert("Stok raporu henuz aktif degil. Detayli raporlar Faz 14'te eklenecek.")
  }

  const reportCards = [
    {
      title: "Satis Raporu",
      icon: ShoppingBag,
      iconColor: "text-green-600 bg-green-50",
      content: (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Baslangic</label>
              <input
                type="date"
                value={salesFrom}
                onChange={(e) => setSalesFrom(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Bitis</label>
              <input
                type="date"
                value={salesTo}
                onChange={(e) => setSalesTo(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4622D]/30 focus:border-[#C4622D]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Toplam Siparis</p>
              <p className="text-lg font-bold text-gray-900">—</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Toplam Ciro</p>
              <p className="text-lg font-bold text-gray-900">—</p>
            </div>
          </div>
        </div>
      ),
      onAction: handleSalesCSV,
      actionLabel: "CSV Indir",
    },
    {
      title: "Urun Raporu",
      icon: Package,
      iconColor: "text-blue-600 bg-blue-50",
      content: (
        <div>
          <p className="text-xs text-gray-500 mb-3">En cok satan 10 urun</p>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-400 w-5">{i + 1}.</span>
                <div className="flex-1 h-3 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Veriler yakin zamanda yüklenecek
          </p>
        </div>
      ),
      onAction: handleProductCSV,
      actionLabel: "CSV Indir",
    },
    {
      title: "Musteri Raporu",
      icon: Users,
      iconColor: "text-purple-600 bg-purple-50",
      content: (
        <div>
          <p className="text-xs text-gray-500 mb-3">Yeni musteri trendi</p>
          <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">Grafik yakinda eklenecek</p>
            </div>
          </div>
        </div>
      ),
      onAction: handleCustomerCSV,
      actionLabel: "CSV Indir",
    },
    {
      title: "Stok Raporu",
      icon: AlertTriangle,
      iconColor: "text-amber-600 bg-amber-50",
      content: (
        <div>
          <p className="text-xs text-gray-500 mb-3">Dusuk stoklu urunler</p>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex-1 h-3 bg-gray-100 rounded animate-pulse" />
                <span className="ml-3 text-xs text-gray-400">— adet</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Veriler yakin zamanda yuklenecek
          </p>
        </div>
      ),
      onAction: handleStockCSV,
      actionLabel: "CSV Indir",
    },
  ]

  return (
    <div className="space-y-6">
      <AdminHeader title="Raporlar" breadcrumb={["Sistem", "Raporlar"]} />

      {/* Info Note */}
      <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <Info size={16} className="text-blue-500 shrink-0" />
        <p className="text-sm text-blue-700">
          Detayli raporlar Faz 14&apos;te eklenecek.
        </p>
      </div>

      {/* Report Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {reportCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white border rounded-xl overflow-hidden"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${card.iconColor}`}>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{card.title}</h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">{card.content}</div>

              {/* Card Action */}
              <div className="px-5 pb-5">
                <button
                  onClick={card.onAction}
                  className="w-full flex items-center justify-center gap-2 border border-[#C4622D] text-[#C4622D] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C4622D]/5 transition-colors"
                >
                  <Download size={14} />
                  {card.actionLabel}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

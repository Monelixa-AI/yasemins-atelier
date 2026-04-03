"use client";

import { useState } from "react";
import { Package, AlertTriangle, TrendingUp, Award } from "lucide-react";

const tabs = ["Ürünler", "Stok Yönetimi", "Kargo Ayarları"];

export default function AdminNaturelPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Naturel Koleksiyon Yönetimi</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Package, label: "Toplam Ürün", value: "15", color: "text-[#4A7C3F]" },
          { icon: AlertTriangle, label: "Stok Uyarısı", value: "3", color: "text-red-500" },
          { icon: TrendingUp, label: "Bu Ay Satış", value: "127", color: "text-blue-600" },
          { icon: Award, label: "En Çok Satan", value: "Granola", color: "text-[#B8975C]" },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={16} className={card.color} />
              <span className="text-xs text-gray-500">{card.label}</span>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === i ? "text-[#4A7C3F] border-b-2 border-[#4A7C3F] -mb-px" : "text-gray-500 hover:text-gray-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ürün</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Kategori</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Fiyat</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Stok</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Ağırlık</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">Kargo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t"><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Naturel ürünler DB seed sonrası burada görünecek.</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 1 && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded p-6">
            <h3 className="text-lg font-semibold mb-4">Stok Hareket Ekle</h3>
            <div className="grid grid-cols-4 gap-4">
              <select className="border px-3 py-2 text-sm rounded"><option>Ürün Seçin</option></select>
              <select className="border px-3 py-2 text-sm rounded"><option>Giriş</option><option>Çıkış</option><option>Düzeltme</option></select>
              <input type="number" placeholder="Miktar" className="border px-3 py-2 text-sm rounded" />
              <button className="bg-[#4A7C3F] text-white text-sm px-4 py-2 rounded hover:bg-[#2D4A1E]">Kaydet</button>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded p-6">
            <h3 className="text-lg font-semibold mb-4">Düşük Stok Uyarıları</h3>
            <p className="text-sm text-gray-400 text-center py-4">Stok uyarıları DB seed sonrası burada görünecek.</p>
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="bg-white border border-gray-200 rounded p-6 max-w-lg">
          <h3 className="text-lg font-semibold mb-4">Kargo Ayarları</h3>
          <div className="space-y-4">
            <div><label className="block text-xs text-gray-500 mb-1">Ücretsiz kargo eşiği</label><input type="number" defaultValue={750} className="border px-3 py-2 text-sm rounded w-full" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Standart kargo fiyatı</label><input type="number" defaultValue={49} className="border px-3 py-2 text-sm rounded w-full" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Hızlı kargo farkı</label><input type="number" defaultValue={25} className="border px-3 py-2 text-sm rounded w-full" /></div>
            <button className="bg-[#4A7C3F] text-white text-sm px-6 py-2 rounded hover:bg-[#2D4A1E]">Kaydet</button>
          </div>
        </div>
      )}
    </div>
  );
}

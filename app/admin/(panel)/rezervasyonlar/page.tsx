"use client";

import { useState } from "react";
import { Calendar, List, Clock } from "lucide-react";

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-yellow-50", text: "text-yellow-700", label: "⏳ Onay Bekleniyor" },
  CONFIRMED: { bg: "bg-green-50", text: "text-green-700", label: "✅ Onaylandı" },
  DEPOSIT_PAID: { bg: "bg-blue-50", text: "text-blue-700", label: "💳 Depozito Ödendi" },
  COMPLETED: { bg: "bg-purple-50", text: "text-purple-700", label: "⭐ Tamamlandı" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", label: "❌ İptal" },
  NO_SHOW: { bg: "bg-gray-50", text: "text-gray-700", label: "🚫 Gelmedi" },
};

export default function AdminReservationsPage() {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlar</h1>
        <div className="flex border border-gray-200 rounded">
          <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-terracotta text-white" : "text-gray-500"}`}><List size={18} /></button>
          <button onClick={() => setView("calendar")} className={`p-2 ${view === "calendar" ? "bg-terracotta text-white" : "text-gray-500"}`}><Calendar size={18} /></button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select className="border border-gray-200 px-3 py-2 text-sm rounded">
          <option>Tüm Hizmetler</option>
          <option>Eve Şef</option>
          <option>Workshop</option>
          <option>Davet Organizasyonu</option>
        </select>
        <select className="border border-gray-200 px-3 py-2 text-sm rounded">
          <option>Tüm Durumlar</option>
          {Object.entries(statusColors).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
        <input type="text" placeholder="İsim, e-posta veya booking no..." className="border border-gray-200 px-3 py-2 text-sm rounded flex-1 min-w-[200px]" />
      </div>

      {view === "list" ? (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <div className="p-8 text-center text-gray-400">
            <Clock size={40} className="mx-auto mb-3" />
            <p className="text-sm">Henüz rezervasyon yok.</p>
            <p className="text-xs mt-1">Müşteriler hizmet sayfalarından rezervasyon oluşturabilir.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded p-6">
          <div className="grid grid-cols-7 gap-1">
            {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square border border-gray-100 p-1">
                <span className="text-xs text-gray-400">{((i % 28) + 1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";

const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const serviceOptions = ["eve-sef", "workshop", "davet-organizasyon", "ofis-yemek", "lezzet-kutusu"];

export default function AdminMusaitlikPage() {
  const [selectedService, setSelectedService] = useState("eve-sef");
  const [schedule, setSchedule] = useState(
    days.map((_, i) => ({ enabled: i < 5, start: "10:00", end: "18:00" }))
  );
  const [blockedDate, setBlockedDate] = useState({ date: "", reason: "", allDay: true });

  const toggleDay = (index: number) => {
    setSchedule((prev) => prev.map((d, i) => i === index ? { ...d, enabled: !d.enabled } : d));
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Müsaitlik Yönetimi</h1>

      {/* Service selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Hizmet Seçin</label>
        <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)} className="border border-gray-200 px-4 py-2 text-sm rounded w-full max-w-xs">
          {serviceOptions.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      {/* Weekly schedule */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Haftalık Çalışma Saatleri</h2>
        <div className="space-y-3">
          {days.map((day, i) => (
            <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
              <label className="flex items-center gap-2 w-32">
                <input type="checkbox" checked={schedule[i].enabled} onChange={() => toggleDay(i)} className="accent-terracotta" />
                <span className="text-sm font-medium">{day}</span>
              </label>
              {schedule[i].enabled ? (
                <div className="flex items-center gap-2">
                  <input type="time" value={schedule[i].start} onChange={(e) => setSchedule((prev) => prev.map((d, j) => j === i ? { ...d, start: e.target.value } : d))} className="border px-2 py-1 text-sm rounded" />
                  <span className="text-gray-400">—</span>
                  <input type="time" value={schedule[i].end} onChange={(e) => setSchedule((prev) => prev.map((d, j) => j === i ? { ...d, end: e.target.value } : d))} className="border px-2 py-1 text-sm rounded" />
                </div>
              ) : (
                <span className="text-sm text-gray-400">Kapalı</span>
              )}
            </div>
          ))}
        </div>
        <button className="mt-4 bg-terracotta text-white text-sm px-6 py-2 rounded hover:bg-terracotta/90">Kaydet</button>
      </section>

      {/* Blocked dates */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Kapalı Günler / İzinler</h2>
        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Tarih</label>
            <input type="date" value={blockedDate.date} onChange={(e) => setBlockedDate({ ...blockedDate, date: e.target.value })} className="border px-3 py-2 text-sm rounded" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Sebep</label>
            <select value={blockedDate.reason} onChange={(e) => setBlockedDate({ ...blockedDate, reason: e.target.value })} className="border px-3 py-2 text-sm rounded">
              <option value="">Seçin</option>
              <option value="Tatil">Tatil</option>
              <option value="Kişisel">Kişisel</option>
              <option value="Başka İş">Başka İş</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          <button className="bg-red-500 text-white text-sm px-4 py-2 rounded hover:bg-red-600">Gün Bloke Et</button>
        </div>
        <div className="bg-gray-50 p-4 rounded text-center text-sm text-gray-400">
          Henüz bloke edilmiş gün yok.
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function ServiceCTA({ serviceName, colorBg }: { serviceName: string; colorBg: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", guests: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, service: serviceName }),
    });
    setSubmitted(true);
  };

  return (
    <section className="py-20" style={{ backgroundColor: colorBg }}>
      <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
        <h2 className="font-heading text-4xl lg:text-5xl text-white">
          {serviceName} İçin Talep Oluşturun
        </h2>
        <p className="font-body text-base text-white/80 mt-4">
          Size en uygun paketi birlikte belirleyelim.
        </p>

        {submitted ? (
          <div className="bg-white max-w-lg mx-auto mt-10 p-10 text-center">
            <span className="text-4xl">✓</span>
            <h3 className="font-heading text-2xl text-brown-deep mt-4">Talebiniz Alındı!</h3>
            <p className="font-body text-sm text-brown-mid mt-2">En geç 24 saat içinde size dönüş yapacağız.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white max-w-lg mx-auto mt-10 p-8 text-left">
            <div className="space-y-4">
              <input type="text" placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep placeholder:text-brown-mid/40 rounded-none focus:outline-none focus:border-terracotta" required />
              <input type="email" placeholder="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep placeholder:text-brown-mid/40 rounded-none focus:outline-none focus:border-terracotta" required />
              <input type="tel" placeholder="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep placeholder:text-brown-mid/40 rounded-none focus:outline-none focus:border-terracotta" required />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep rounded-none focus:outline-none focus:border-terracotta" />
              <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep rounded-none focus:outline-none focus:border-terracotta appearance-none bg-white">
                <option value="">Kişi Sayısı</option>
                <option value="2-4">2-4 kişi</option>
                <option value="4-8">4-8 kişi</option>
                <option value="8-12">8-12 kişi</option>
                <option value="12-20">12-20 kişi</option>
                <option value="20+">20+ kişi</option>
              </select>
              <textarea placeholder="Notlar, özel istekler..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full border border-gold-light px-4 py-3 font-body text-sm text-brown-deep placeholder:text-brown-mid/40 rounded-none focus:outline-none focus:border-terracotta resize-none" />
            </div>
            <button type="submit" className="w-full mt-6 py-4 text-white font-body text-sm font-medium rounded-none hover:opacity-90 transition-opacity" style={{ backgroundColor: colorBg }}>
              Talep Gönder
            </button>
            <p className="font-body text-xs text-brown-mid text-center mt-3">En geç 24 saat içinde dönüş yapılır.</p>
          </form>
        )}
      </div>
    </section>
  );
}

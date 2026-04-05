"use client";

import { useState } from "react";
import { Send, CheckCircle, Building2 } from "lucide-react";

const volumeOptions = [
  "Aylık 1.000–5.000 TL",
  "Aylık 5.000–15.000 TL",
  "Aylık 15.000–50.000 TL",
  "Aylık 50.000 TL üzeri",
];

const needOptions = [
  "İş Yemeği",
  "Kurumsal Hediye",
  "Ofis İkramı",
  "Etkinlik",
];

export default function CorporateCTA() {
  const [form, setForm] = useState({
    companyName: "",
    taxNumber: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    invoiceAddress: "",
    estimatedVolume: "",
    needs: [] as string[],
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleNeed(n: string) {
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(n)
        ? prev.needs.filter((x) => x !== n)
        : [...prev.needs, n],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/corporate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Başvuru gönderilemedi");
      setSuccess(true);
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="bg-[#3D1A0A] py-20 lg:py-28">
        <div className="max-w-xl mx-auto px-4 text-center">
          <CheckCircle size={56} className="text-[#B8975C] mx-auto mb-6" />
          <h2 className="font-heading text-3xl text-white mb-4">
            Başvurunuz Alındı!
          </h2>
          <p className="font-body text-white/70">
            Kurumsal ekibimiz en kısa sürede sizinle iletişime geçecektir.
            Genellikle 1-2 iş günü içinde dönüş yapılmaktadır.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="bg-[#3D1A0A] py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <Building2 size={32} className="text-[#B8975C] mx-auto mb-4" />
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-3">
            Kurumsal Başvuru
          </h2>
          <p className="font-body text-white/60">
            Formu doldurun, size özel teklifimizi hazırlayalım.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Şirket Adı" required value={form.companyName}
              onChange={(v) => setForm((p) => ({ ...p, companyName: v }))} />
            <Input label="Vergi Numarası" required value={form.taxNumber}
              onChange={(v) => setForm((p) => ({ ...p, taxNumber: v }))} />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="İletişim Adı" required value={form.contactName}
              onChange={(v) => setForm((p) => ({ ...p, contactName: v }))} />
            <Input label="Telefon" required value={form.contactPhone}
              onChange={(v) => setForm((p) => ({ ...p, contactPhone: v }))} />
            <Input label="E-posta" type="email" required value={form.contactEmail}
              onChange={(v) => setForm((p) => ({ ...p, contactEmail: v }))} />
          </div>

          {/* Address */}
          <div>
            <label className="block text-white/70 font-body text-sm mb-1.5">
              Fatura Adresi <span className="text-[#C4622D]">*</span>
            </label>
            <textarea
              required rows={2}
              value={form.invoiceAddress}
              onChange={(e) => setForm((p) => ({ ...p, invoiceAddress: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#B8975C] transition-colors resize-none"
            />
          </div>

          {/* Volume */}
          <div>
            <label className="block text-white/70 font-body text-sm mb-1.5">
              Tahmini Aylık Hacim
            </label>
            <select
              value={form.estimatedVolume}
              onChange={(e) => setForm((p) => ({ ...p, estimatedVolume: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#B8975C] transition-colors"
            >
              <option value="">Seçiniz</option>
              {volumeOptions.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Needs */}
          <div>
            <label className="block text-white/70 font-body text-sm mb-2">
              İhtiyaçlarınız
            </label>
            <div className="flex flex-wrap gap-3">
              {needOptions.map((n) => (
                <button key={n} type="button" onClick={() => toggleNeed(n)}
                  className={`px-4 py-2 rounded-full font-body text-sm transition-colors ${
                    form.needs.includes(n)
                      ? "bg-[#C4622D] text-white"
                      : "bg-white/5 text-white/60 border border-white/10 hover:border-white/30"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-white/70 font-body text-sm mb-1.5">
              Ek Notlar
            </label>
            <textarea
              rows={3} value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#B8975C] transition-colors resize-none"
              placeholder="Özel isteklerinizi belirtin..."
            />
          </div>

          {error && (
            <p className="text-red-400 font-body text-sm">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C4622D] hover:bg-[#C4622D]/90 disabled:opacity-50 text-white font-body font-medium text-sm rounded-lg transition-colors"
          >
            <Send size={16} />
            {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---- tiny reusable input ---- */
function Input({
  label, value, onChange, required, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-white/70 font-body text-sm mb-1.5">
        {label} {required && <span className="text-[#C4622D]">*</span>}
      </label>
      <input
        type={type} required={required} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-[#B8975C] transition-colors"
      />
    </div>
  );
}

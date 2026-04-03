"use client";

import { useState } from "react";
import Link from "next/link";

export default function GirisPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", password2: "", emailConsent: false, smsConsent: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // NextAuth signIn will be integrated in production
    console.log("Login:", form.email);
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (form.password !== form.password2) { setError("Şifreler eşleşmiyor"); setLoading(false); return; }
    if (form.password.length < 6) { setError("Şifre en az 6 karakter olmalı"); setLoading(false); return; }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, emailConsent: form.emailConsent, smsConsent: form.smsConsent }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      setTab("login");
      setError("");
    } catch { setError("Bir hata oluştu"); }
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Tabs */}
        <div className="flex border-b border-gold-light mb-8">
          <button onClick={() => setTab("login")} className={`flex-1 py-3 font-body text-sm font-medium transition-colors ${tab === "login" ? "text-terracotta border-b-2 border-terracotta -mb-px" : "text-brown-mid"}`}>
            Giriş Yap
          </button>
          <button onClick={() => setTab("register")} className={`flex-1 py-3 font-body text-sm font-medium transition-colors ${tab === "register" ? "text-terracotta border-b-2 border-terracotta -mb-px" : "text-brown-mid"}`}>
            Üye Ol
          </button>
        </div>

        {error && <p className="font-body text-sm text-red-600 mb-4 bg-red-50 px-4 py-2">{error}</p>}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" required />
            <input type="password" placeholder="Şifre" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" required />
            <button type="submit" disabled={loading} className="w-full bg-terracotta text-white font-body text-sm font-medium py-4 rounded-none hover:bg-terracotta-dark transition-colors disabled:opacity-50">
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
            <Link href="/sifremi-unuttum" className="block text-center font-body text-xs text-terracotta hover:text-terracotta-dark">Şifremi Unuttum</Link>
            <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gold-light" /></div><div className="relative flex justify-center"><span className="bg-white px-4 font-body text-xs text-brown-mid">veya</span></div></div>
            <Link href="/checkout" className="block text-center font-body text-sm text-brown-mid border border-gold-light py-3 hover:border-terracotta transition-colors">Misafir olarak devam</Link>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" required />
            <input type="email" placeholder="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" required />
            <input type="password" placeholder="Şifre (min 6 karakter)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" required />
            <input type="password" placeholder="Şifre Tekrar" value={form.password2} onChange={(e) => setForm({ ...form, password2: e.target.value })} className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" required />
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.emailConsent} onChange={(e) => setForm({ ...form, emailConsent: e.target.checked })} className="accent-terracotta" /><span className="font-body text-xs text-brown-mid">E-posta ile kampanyalardan haberdar olmak istiyorum</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.smsConsent} onChange={(e) => setForm({ ...form, smsConsent: e.target.checked })} className="accent-terracotta" /><span className="font-body text-xs text-brown-mid">SMS bildirimleri almak istiyorum</span></label>
            <button type="submit" disabled={loading} className="w-full bg-terracotta text-white font-body text-sm font-medium py-4 rounded-none hover:bg-terracotta-dark transition-colors disabled:opacity-50">
              {loading ? "Kayıt yapılıyor..." : "Üye Ol"}
            </button>
            <p className="font-body text-[10px] text-brown-mid text-center">Üye olarak <Link href="/kullanim-kosullari" className="underline">Kullanım Koşulları</Link> ve <Link href="/kvkk" className="underline">KVKK</Link> politikasını kabul etmiş olursunuz.</p>
          </form>
        )}
      </div>
    </div>
  );
}

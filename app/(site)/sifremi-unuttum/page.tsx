"use client";

import { useState } from "react";
import Link from "next/link";

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/auth/forgot-password", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="font-heading text-3xl text-brown-deep">Şifremi Unuttum</h1>

        {sent ? (
          <div className="mt-8">
            <p className="font-body text-sm text-brown-mid">E-posta adresinize şifre sıfırlama bağlantısı gönderildi.</p>
            <Link href="/giris" className="inline-block mt-6 font-body text-sm text-terracotta hover:text-terracotta-dark underline underline-offset-4">Giriş sayfasına dön</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <p className="font-body text-sm text-brown-mid">E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim.</p>
            <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gold-light px-4 py-3 font-body text-sm rounded-none focus:outline-none focus:border-terracotta" required />
            <button type="submit" className="w-full bg-terracotta text-white font-body text-sm font-medium py-4 rounded-none hover:bg-terracotta-dark transition-colors">Gönder</button>
          </form>
        )}
      </div>
    </div>
  );
}

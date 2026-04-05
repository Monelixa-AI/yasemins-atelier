"use client"

import { useState } from "react"
import Link from "next/link"
import { MailX, CheckCircle } from "lucide-react"

export default function UnsubscribePage() {
  const [resubEmail, setResubEmail] = useState("")
  const [resubbed, setResubbed] = useState(false)

  const handleResub = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resubEmail) return

    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resubEmail }),
      })
      setResubbed(true)
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12">
      <MailX size={48} className="text-brown-mid/40 mb-4" />
      <h1 className="font-heading text-2xl text-brown-deep mb-2">Aboneliğiniz İptal Edildi</h1>
      <p className="font-body text-sm text-brown-mid max-w-md text-center mb-8">
        Artık Yasemin&apos;s Atelier bültenlerini almayacaksınız.
      </p>

      {resubbed ? (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={16} />
          <span className="font-body text-sm">Yeniden abone oldunuz! Onay e-postası gönderildi.</span>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-body text-xs text-brown-mid mb-3">Yeniden abone olmak ister misiniz?</p>
          <form onSubmit={handleResub} className="flex gap-2">
            <input
              type="email"
              value={resubEmail}
              onChange={(e) => setResubEmail(e.target.value)}
              className="border border-gold-light px-3 py-2 font-body text-sm w-60 focus:outline-none focus:border-terracotta"
              placeholder="E-posta adresiniz"
              required
            />
            <button
              type="submit"
              className="bg-terracotta text-white font-body text-sm px-4 py-2 hover:bg-terracotta-dark transition-colors"
            >
              Abone Ol
            </button>
          </form>
        </div>
      )}

      <Link href="/" className="mt-8 font-body text-xs text-brown-mid hover:text-terracotta">
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}

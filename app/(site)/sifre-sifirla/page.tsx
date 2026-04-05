"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { KeyRound, Loader2, CheckCircle, XCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  if (!token) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <XCircle size={48} className="text-red-400 mb-4" />
        <h1 className="font-heading text-2xl text-brown-deep mb-2">Geçersiz Link</h1>
        <p className="font-body text-sm text-brown-mid mb-6">
          Şifre sıfırlama linki geçersiz veya süresi dolmuş.
        </p>
        <Link href="/sifremi-unuttum" className="font-body text-sm text-terracotta hover:underline">
          Yeni link talep et →
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.")
      return
    }
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => router.push("/giris"), 3000)
      } else {
        const data = await res.json()
        setError(data.error || "Bir hata oluştu. Link süresi dolmuş olabilir.")
      }
    } catch {
      setError("Bağlantı hatası.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <CheckCircle size={48} className="text-green-500 mb-4" />
        <h1 className="font-heading text-2xl text-brown-deep mb-2">Şifreniz Güncellendi!</h1>
        <p className="font-body text-sm text-brown-mid">
          Giriş sayfasına yönlendiriliyorsunuz...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <KeyRound size={40} className="text-gold mx-auto mb-3" />
          <h1 className="font-heading text-3xl text-brown-deep">Yeni Şifre Belirle</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-body text-xs font-medium text-brown-deep block mb-1">
              Yeni Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gold-light px-4 py-3 font-body text-sm focus:outline-none focus:border-terracotta"
              placeholder="En az 6 karakter"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="font-body text-xs font-medium text-brown-deep block mb-1">
              Şifre Tekrar
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gold-light px-4 py-3 font-body text-sm focus:outline-none focus:border-terracotta"
              placeholder="Şifrenizi tekrar girin"
              required
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta text-white font-body text-sm font-medium py-4 hover:bg-terracotta-dark transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Güncelleniyor...
              </span>
            ) : (
              "Şifremi Güncelle"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

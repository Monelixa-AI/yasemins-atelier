"use client"

import { useState, useEffect, useRef } from "react"

interface IyzicoPaymentFormProps {
  orderId: string
  onError: (message: string) => void
}

export function IyzicoPaymentForm({ orderId, onError }: IyzicoPaymentFormProps) {
  const [checkoutForm, setCheckoutForm] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function initializePayment() {
      try {
        const res = await fetch("/api/payments/iyzico/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        })

        const data = await res.json()

        if (!res.ok) {
          onError(data.error || "iyzico başlatılamadı")
          return
        }

        setCheckoutForm(data.checkoutFormContent)
      } catch {
        onError("iyzico bağlantı hatası")
      } finally {
        setIsLoading(false)
      }
    }

    initializePayment()
  }, [orderId, onError])

  useEffect(() => {
    if (checkoutForm && formRef.current) {
      const scripts = formRef.current.getElementsByTagName("script")
      for (let i = 0; i < scripts.length; i++) {
        const script = document.createElement("script")
        script.text = scripts[i].text
        document.body.appendChild(script)
      }
    }
  }, [checkoutForm])

  if (isLoading) {
    return (
      <div className="border border-[#E8D5A3] rounded-xl p-8 bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#B8975C]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-[#6B3520]">iyzico ödeme formu yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (!checkoutForm) {
    return (
      <div className="border border-red-200 rounded-xl p-6 bg-red-50 text-center">
        <p className="text-sm text-red-600">Ödeme formu yüklenemedi. Lütfen tekrar deneyin.</p>
      </div>
    )
  }

  return (
    <div className="border border-[#E8D5A3] rounded-xl p-6 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-[#B8975C]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span className="text-xs text-[#B8975C]">iyzico güvenli ödeme altyapısı</span>
      </div>

      <div
        ref={formRef}
        dangerouslySetInnerHTML={{ __html: checkoutForm }}
      />

      <p className="mt-4 text-xs text-center text-gray-400">
        Troy, Visa, Mastercard — Taksit imkanı
      </p>
    </div>
  )
}

"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { PartyPopper, Loader2, MessageCircle } from "lucide-react"
import confetti from "canvas-confetti"

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")
  const paymentIntent = searchParams.get("payment_intent")

  const [order, setOrder] = useState<{
    orderNumber: string
    total: number
    status: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          setOrder(data)
          confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } })
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 size={40} className="animate-spin text-terracotta" />
        <p className="font-body text-sm text-brown-mid mt-4">Ödemeniz doğrulanıyor...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <PartyPopper size={40} className="text-green-600" />
      </div>

      <h1 className="font-heading text-3xl text-brown-deep mb-3">Siparişiniz Alındı!</h1>

      <p className="font-body text-sm text-brown-mid max-w-md text-center mb-6">
        Ödemeniz başarıyla tamamlandı. Onay e-postası en kısa sürede gönderilecektir.
      </p>

      {order?.orderNumber && (
        <div className="bg-cream inline-block px-8 py-4 mb-8">
          <p className="font-body text-xs text-brown-mid text-center">Sipariş No</p>
          <p className="font-heading text-3xl text-terracotta font-bold text-center">
            {order.orderNumber}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `Yasemin's Atelier siparişim: ${order?.orderNumber || ""}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-body text-sm px-6 py-3 hover:bg-green-700 transition-colors"
        >
          <MessageCircle size={16} />
          WhatsApp ile Paylaş
        </a>
        {orderId && (
          <a
            href={`/api/invoices/${orderId}`}
            className="inline-flex items-center justify-center gap-2 border-2 border-terracotta text-terracotta font-body text-sm px-6 py-3 hover:bg-terracotta hover:text-white transition-colors"
          >
            Fatura İndir
          </a>
        )}
        <Link
          href="/menu"
          className="inline-flex items-center justify-center gap-2 border-2 border-gold text-brown-mid font-body text-sm px-6 py-3 hover:bg-cream transition-colors"
        >
          Alışverişe Devam
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 size={40} className="animate-spin text-terracotta" />
          <p className="font-body text-sm text-brown-mid mt-4">Yükleniyor...</p>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  )
}

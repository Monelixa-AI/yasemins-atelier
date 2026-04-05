"use client"

import { useState } from "react"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { getStripe } from "@/lib/stripe-client"

interface StripePaymentFormProps {
  clientSecret: string
  orderId: string
  onSuccess: (paymentIntentId: string) => void
  onError: (message: string) => void
}

function InnerPaymentForm({
  orderId,
  onSuccess,
  onError,
}: Omit<StripePaymentFormProps, "clientSecret">) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
      },
      redirect: "if_required",
    })

    if (result.error) {
      onError(result.error.message || "Ödeme sırasında bir hata oluştu")
      setIsProcessing(false)
    } else if (result.paymentIntent) {
      onSuccess(result.paymentIntent.id)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-[#E8D5A3] rounded-xl p-6 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-[#B8975C]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs text-[#B8975C]">256-bit SSL ile güvenli ödeme</span>
        </div>

        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full mt-6 bg-[#3D1A0A] text-white py-3.5 rounded-lg font-medium
                     hover:bg-[#5A2D1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Ödeme İşleniyor...
            </span>
          ) : (
            "Ödemeyi Tamamla"
          )}
        </button>
      </div>
    </form>
  )
}

export function StripePaymentForm({ clientSecret, orderId, onSuccess, onError }: StripePaymentFormProps) {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        clientSecret,
        locale: "tr",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#B8975C",
            colorBackground: "#ffffff",
            colorText: "#3D1A0A",
            borderRadius: "8px",
            fontFamily: "Inter, system-ui, sans-serif",
          },
        },
      }}
    >
      <InnerPaymentForm orderId={orderId} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}

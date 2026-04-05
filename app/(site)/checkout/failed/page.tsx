"use client"

import Link from "next/link"
import { XCircle, MessageCircle } from "lucide-react"

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12 bg-[#FDF6EE]">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <XCircle size={40} className="text-red-500" />
      </div>

      <h1 className="font-heading text-3xl text-[#3D1A0A] mb-3">Ödeme Başarısız</h1>

      <p className="font-body text-[15px] text-[#6B3520] max-w-md text-center mb-2">
        Kartınız reddedildi veya bir hata oluştu.
      </p>
      <p className="font-body text-sm text-[#6B3520] max-w-md text-center mb-8">
        Lütfen kart bilgilerinizi kontrol edin veya farklı bir ödeme yöntemi deneyin.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/checkout"
          className="inline-flex items-center justify-center gap-2 bg-terracotta text-white font-body text-sm px-8 py-3 hover:bg-terracotta-dark transition-colors"
        >
          Tekrar Dene
        </Link>
        <a
          href="https://wa.me/905XXXXXXXXX"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 font-body text-sm px-6 py-3 hover:bg-green-600 hover:text-white transition-colors"
        >
          <MessageCircle size={16} />
          Yardım Al
        </a>
      </div>
    </div>
  )
}

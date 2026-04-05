"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Mail, Heart, Loader2 } from "lucide-react"

const MESSAGES: Record<string, { icon: typeof CheckCircle; title: string; desc: string }> = {
  newsletter: {
    icon: Mail,
    title: "Bültene Abone Oldunuz!",
    desc: "İlk e-postanız yakında gelecek. Yasemin'in mutfak notları, mevsim hikayeleri ve özel teklifler sizi bekliyor.",
  },
  default: {
    icon: Heart,
    title: "Teşekkürler!",
    desc: "İşleminiz başarıyla tamamlandı.",
  },
}

function ThankYouContent() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "default"
  const config = MESSAGES[type] || MESSAGES.default
  const Icon = config.icon

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <Icon size={32} className="text-green-600" />
      </div>
      <h1 className="font-heading text-3xl text-brown-deep mb-3">{config.title}</h1>
      <p className="font-body text-sm text-brown-mid max-w-md text-center mb-8">{config.desc}</p>
      <Link
        href="/"
        className="font-body text-sm text-terracotta hover:text-terracotta-dark underline underline-offset-4"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-terracotta" />
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  )
}

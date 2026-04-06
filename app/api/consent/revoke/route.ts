import { NextResponse } from "next/server"
import { revokeConsent } from "@/lib/legal/consent"
import { ConsentType } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, consentType } = body

    if (!userId || !consentType) {
      return NextResponse.json(
        { error: "userId ve consentType gerekli" },
        { status: 400 }
      )
    }

    await revokeConsent(userId, consentType as ConsentType, "user_settings")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Consent revoke POST hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

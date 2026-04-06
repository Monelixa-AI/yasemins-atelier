import { NextResponse } from "next/server"
import { recordConsent } from "@/lib/legal/consent"
import { ConsentType } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { analytics, marketing, preference, userId, sessionId, ipAddress } = body

    const cookieTypes: { key: string; type: ConsentType }[] = [
      { key: "analytics", type: "ANALYTICS_COOKIES" },
      { key: "marketing", type: "MARKETING_COOKIES" },
      { key: "preference", type: "PREFERENCE_COOKIES" },
    ]

    const values: Record<string, boolean | undefined> = {
      analytics,
      marketing,
      preference,
    }

    await Promise.all(
      cookieTypes
        .filter((ct) => values[ct.key] !== undefined)
        .map((ct) =>
          recordConsent(
            userId ?? null,
            sessionId ?? null,
            ct.type,
            !!values[ct.key],
            "cookie_banner",
            undefined,
            ipAddress
          )
        )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cookie consent POST hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

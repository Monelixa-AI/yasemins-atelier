import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import React from "react"
import NewsletterCampaign from "@/emails/NewsletterCampaign"

export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Email campaigns GET hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { subject, headline, body, ctaText, ctaUrl, segmentId } =
      await request.json()

    if (!subject || !headline || !body) {
      return NextResponse.json(
        { error: "subject, headline ve body gerekli" },
        { status: 400 }
      )
    }

    let recipients: { email: string }[] = []

    if (segmentId) {
      const segment = await prisma.customerSegment.findUnique({
        where: { id: segmentId },
        include: {
          users: {
            where: { isActive: true, emailConsent: true },
            select: { email: true },
          },
        },
      })

      if (!segment) {
        return NextResponse.json(
          { error: "Segment bulunamadi" },
          { status: 404 }
        )
      }

      recipients = segment.users
    } else {
      const subscribers = await prisma.newsletterSubscriber.findMany({
        where: {
          isActive: true,
          confirmedAt: { not: null },
        },
        select: { email: true },
      })

      recipients = subscribers
    }

    let sent = 0

    for (const recipient of recipients) {
      const template = React.createElement(NewsletterCampaign, {
        headline,
        body,
        ctaText,
        ctaUrl,
        unsubscribeUrl: `https://yaseminsatelier.com/unsubscribe?email=${encodeURIComponent(recipient.email)}`,
      })

      const success = await sendEmail(recipient.email, subject, template)
      if (success) sent++
    }

    return NextResponse.json({ sent })
  } catch (error) {
    console.error("Email campaigns POST hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendSMS } from "@/lib/sms"

export async function POST(request: Request) {
  try {
    const { message, segmentId, phones } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "message gerekli" },
        { status: 400 }
      )
    }

    let phoneList: string[] = []

    if (phones && Array.isArray(phones) && phones.length > 0) {
      phoneList = phones
    } else if (segmentId) {
      const segment = await prisma.customerSegment.findUnique({
        where: { id: segmentId },
        include: {
          users: {
            where: {
              isActive: true,
              smsConsent: true,
              phone: { not: null },
            },
            select: { phone: true },
          },
        },
      })

      if (!segment) {
        return NextResponse.json(
          { error: "Segment bulunamadi" },
          { status: 404 }
        )
      }

      phoneList = segment.users
        .map((u) => u.phone)
        .filter((p): p is string => p !== null)
    } else {
      const users = await prisma.user.findMany({
        where: {
          isActive: true,
          smsConsent: true,
          phone: { not: null },
        },
        select: { phone: true },
      })

      phoneList = users
        .map((u) => u.phone)
        .filter((p): p is string => p !== null)
    }

    let sent = 0
    let failed = 0

    for (const phone of phoneList) {
      const success = await sendSMS(phone, message)
      if (success) {
        sent++
      } else {
        failed++
      }
    }

    return NextResponse.json({ sent, failed })
  } catch (error) {
    console.error("SMS send hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

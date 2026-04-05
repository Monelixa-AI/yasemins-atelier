export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { createEvents, EventAttributes } from "ics"

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: params.id },
    })

    if (!booking) {
      return NextResponse.json({ error: "Bulunamadi" }, { status: 404 })
    }

    const bookedDate = new Date(booking.bookedDate)
    const year = bookedDate.getFullYear()
    const month = bookedDate.getMonth() + 1
    const day = bookedDate.getDate()

    const [startHour, startMinute] = booking.startTime.split(":").map(Number)
    const [endHour, endMinute] = booking.endTime.split(":").map(Number)

    const durationHours = endHour - startHour
    const durationMinutes = endMinute - startMinute

    const event: EventAttributes = {
      start: [year, month, day, startHour, startMinute],
      duration: {
        hours: durationHours >= 0 ? durationHours : 0,
        minutes: durationMinutes >= 0 ? durationMinutes : 0,
      },
      title: `Yasemin's Atelier — ${booking.serviceSlug}`,
      description: `Rezervasyon No: ${booking.bookingNumber}\nPaket: ${booking.packageName}`,
      location: booking.address || "Yasemin's Atelier, Istanbul",
      status: "CONFIRMED" as const,
      organizer: {
        name: "Yasemin's Atelier",
        email: "info@yaseminsatelier.com",
      },
    }

    const { error, value } = createEvents([event])

    if (error || !value) {
      console.error("ICS olusturma hatasi:", error)
      return NextResponse.json(
        { error: "Takvim dosyasi olusturulamadi" },
        { status: 500 }
      )
    }

    return new Response(value, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": `attachment; filename="rezervasyon-${booking.bookingNumber}.ics"`,
      },
    })
  } catch (error) {
    console.error("Calendar export hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

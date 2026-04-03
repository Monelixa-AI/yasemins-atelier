import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAvailableSlots } from "@/lib/utils/slots";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceSlug, packageName, packagePrice, depositAmount, guestName, guestEmail, guestPhone, guestCount, bookedDate, startTime, endTime, address, notes } = body;

    if (!serviceSlug || !packageName || !guestName || !guestEmail || !guestPhone || !bookedDate || !startTime) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    // Race condition check
    const slots = await getAvailableSlots(serviceSlug, new Date(bookedDate));
    const slot = slots.find((s) => s.startTime === startTime);
    if (!slot?.available) {
      return NextResponse.json({ error: "Bu saat aralığı artık dolu" }, { status: 409 });
    }

    const booking = await prisma.serviceBooking.create({
      data: {
        serviceSlug, packageName, packagePrice: packagePrice || 0, depositAmount: depositAmount || 0,
        guestName, guestEmail, guestPhone, guestCount: guestCount || 1,
        bookedDate: new Date(bookedDate), startTime, endTime: endTime || startTime,
        address, notes,
        timeline: { create: { status: "PENDING", note: "Rezervasyon talebi oluşturuldu" } },
      },
    });

    return NextResponse.json({ bookingId: booking.id, bookingNumber: booking.bookingNumber }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

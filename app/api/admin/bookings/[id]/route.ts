import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBookingApproved } from "@/lib/email";
import { sendSMS, SMS_TEMPLATES } from "@/lib/sms";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status, adminNote } = await request.json();
    const updatedBooking = await prisma.serviceBooking.update({
      where: { id: params.id },
      data: {
        status, adminNote,
        timeline: { create: { status, note: adminNote || `Admin güncelleme: ${status}`, createdBy: "admin" } },
      },
      include: { timeline: true },
    });

    if (status === "CONFIRMED") {
      sendBookingApproved(updatedBooking).catch(console.error)
      sendSMS(updatedBooking.guestPhone, SMS_TEMPLATES.bookingApproved(updatedBooking.serviceSlug)).catch(console.error)
    }

    return NextResponse.json(updatedBooking);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status, adminNote } = await request.json();
    const booking = await prisma.serviceBooking.update({
      where: { id: params.id },
      data: {
        status, adminNote,
        timeline: { create: { status, note: adminNote || `Admin güncelleme: ${status}`, createdBy: "admin" } },
      },
      include: { timeline: true },
    });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

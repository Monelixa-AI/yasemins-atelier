import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.serviceBooking.findUnique({
      where: { id: params.id },
      include: { timeline: { orderBy: { createdAt: "desc" } } },
    });
    if (!booking) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
    return NextResponse.json(booking);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status, cancelReason } = await request.json();

    const booking = await prisma.serviceBooking.findUnique({ where: { id: params.id } });
    if (!booking) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });

    if (status === "CANCELLED" && !["PENDING", "CONFIRMED"].includes(booking.status)) {
      return NextResponse.json({ error: "Bu durumda iptal edilemez" }, { status: 400 });
    }

    const updated = await prisma.serviceBooking.update({
      where: { id: params.id },
      data: {
        status,
        cancelReason: status === "CANCELLED" ? cancelReason : undefined,
        cancelledAt: status === "CANCELLED" ? new Date() : undefined,
        timeline: { create: { status, note: cancelReason || `Durum güncellendi: ${status}` } },
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

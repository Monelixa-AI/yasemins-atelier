import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { popupId, email } = await request.json();

    if (!popupId) {
      return NextResponse.json({ error: "popupId gerekli" }, { status: 400 });
    }

    await prisma.popup.update({
      where: { id: popupId },
      data: { conversions: { increment: 1 } },
    });

    // If email provided, upsert newsletter subscriber
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      await prisma.newsletterSubscriber.upsert({
        where: { email },
        update: {},
        create: {
          email,
          source: "popup",
          confirmedAt: null,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Donusum kaydedilemedi" }, { status: 500 });
  }
}

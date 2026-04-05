import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { popupId } = await request.json();

    if (!popupId) {
      return NextResponse.json({ error: "popupId gerekli" }, { status: 400 });
    }

    await prisma.popup.update({
      where: { id: popupId },
      data: { impressions: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Impression kaydedilemedi" }, { status: 500 });
  }
}

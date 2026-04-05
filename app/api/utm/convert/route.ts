import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { sessionId, orderId } = await request.json();

    if (!sessionId || !orderId) {
      return NextResponse.json({ error: "sessionId ve orderId gerekli" }, { status: 400 });
    }

    const utmClick = await prisma.uTMClick.findFirst({
      where: { sessionId },
    });

    if (!utmClick) {
      return NextResponse.json({ error: "UTM oturumu bulunamadi" }, { status: 404 });
    }

    await prisma.uTMClick.update({
      where: { id: utmClick.id },
      data: { orderId },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "UTM donusumu kaydedilemedi" }, { status: 500 });
  }
}

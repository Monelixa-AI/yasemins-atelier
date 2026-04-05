import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const popups = await prisma.popup.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(popups);
  } catch {
    return NextResponse.json({ error: "Popup listesi alinamadi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const popup = await prisma.popup.create({
      data: {
        name: data.name,
        type: data.type,
        title: data.title,
        subtitle: data.subtitle || null,
        body: data.body || null,
        imageUrl: data.imageUrl || null,
        ctaText: data.ctaText || null,
        ctaUrl: data.ctaUrl || null,
        inputPlaceholder: data.inputPlaceholder || null,
        trigger: data.trigger,
        triggerDelay: data.triggerDelay || null,
        triggerScroll: data.triggerScroll || null,
        showOnPages: data.showOnPages || [],
        excludePages: data.excludePages || [],
        showOnDevices: data.showOnDevices || [],
        showOnce: data.showOnce ?? true,
        showAfterDays: data.showAfterDays || null,
        maxShows: data.maxShows || null,
        targetSegment: data.targetSegment || null,
        newVisitorOnly: data.newVisitorOnly ?? false,
        position: data.position || "center",
        bgColor: data.bgColor || "#FFFFFF",
        textColor: data.textColor || "#3D1A0A",
        isActive: data.isActive ?? false,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
      },
    });

    return NextResponse.json(popup, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Popup olusturulamadi" }, { status: 500 });
  }
}

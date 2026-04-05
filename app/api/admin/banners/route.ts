import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(banners);
  } catch {
    return NextResponse.json({ error: "Banner listesi alinamadi" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const banner = await prisma.banner.create({
      data: {
        name: data.name,
        content: data.content,
        linkUrl: data.linkUrl || null,
        bgColor: data.bgColor || "#C4622D",
        textColor: data.textColor || "#FFFFFF",
        isCloseable: data.isCloseable ?? true,
        position: data.position || "top",
        isActive: data.isActive ?? false,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        showOnPages: data.showOnPages || [],
        priority: data.priority || 0,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Banner olusturulamadi" }, { status: 500 });
  }
}

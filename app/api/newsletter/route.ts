import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta girin" }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Bu e-posta zaten kayıtlı." }, { status: 200 });
    }

    await prisma.newsletterSubscriber.create({
      data: { email, source: "website", confirmedAt: new Date() },
    });

    return NextResponse.json({ message: "Abone oldunuz!" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

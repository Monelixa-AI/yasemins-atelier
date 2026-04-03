import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password, emailConsent, smsConsent } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Ad, e-posta ve şifre gerekli" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Şifre en az 6 karakter olmalı" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, email, passwordHash, emailConsent: !!emailConsent, smsConsent: !!smsConsent, consentDate: new Date(), consentSource: "website" },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

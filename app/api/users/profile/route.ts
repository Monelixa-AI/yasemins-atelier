import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, birthDate: user.birthDate, loyaltyPoints: user.loyaltyPoints, loyaltyTier: user.loyaltyTier });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    const { name, phone, birthDate } = await request.json();
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, phone, birthDate: birthDate ? new Date(birthDate) : undefined },
    });
    return NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

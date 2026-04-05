import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const corporateId = searchParams.get("corporateId");

    if (!corporateId) {
      return NextResponse.json({ error: "corporateId parametresi zorunlu" }, { status: 400 });
    }

    const members = await prisma.corporateMember.findMany({
      where: { corporateId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { invitedAt: "desc" },
    });

    return NextResponse.json({ members });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { corporateId, userId, role, maxOrderAmount } = await request.json();

    if (!corporateId || !userId || !role) {
      return NextResponse.json({ error: "corporateId, userId ve role zorunlu" }, { status: 400 });
    }

    const member = await prisma.corporateMember.create({
      data: {
        corporateId,
        userId,
        role,
        maxOrderAmount: maxOrderAmount || null,
        invitedAt: new Date(),
        joinedAt: null,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

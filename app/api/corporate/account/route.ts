import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId parametresi zorunlu" }, { status: 400 });
    }

    const account = await prisma.corporateAccount.findUnique({
      where: { userId },
      include: {
        priceGroup: true,
        _count: { select: { members: true, orders: true } },
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Kurumsal hesap bulunamadi" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

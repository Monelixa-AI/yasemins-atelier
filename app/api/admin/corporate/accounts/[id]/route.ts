import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const account = await prisma.corporateAccount.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        priceGroup: true,
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        orders: {
          take: 20,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
        invoices: { orderBy: { createdAt: "desc" }, take: 10 },
        _count: { select: { orders: true, members: true, bulkOrders: true } },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Hesap bulunamadi" }, { status: 404 });
    }

    return NextResponse.json(account);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { priceGroupId, paymentTermDays, creditLimit, status, requiresApproval } = data;

    const account = await prisma.corporateAccount.update({
      where: { id: params.id },
      data: {
        ...(priceGroupId !== undefined && { priceGroupId }),
        ...(paymentTermDays !== undefined && { paymentTermDays }),
        ...(creditLimit !== undefined && { creditLimit }),
        ...(status !== undefined && { status }),
        ...(requiresApproval !== undefined && { requiresApproval }),
      },
    });

    return NextResponse.json(account);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

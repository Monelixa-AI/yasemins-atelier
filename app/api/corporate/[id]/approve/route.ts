import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { priceGroupId, paymentTermDays, creditLimit, approvedBy } = await request.json();

    if (!approvedBy) {
      return NextResponse.json({ error: "approvedBy zorunlu" }, { status: 400 });
    }

    const account = await prisma.corporateAccount.update({
      where: { id: params.id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        approvedBy,
        ...(priceGroupId && { priceGroupId }),
        ...(paymentTermDays !== undefined && { paymentTermDays }),
        ...(creditLimit !== undefined && { creditLimit }),
      },
    });

    await prisma.user.update({
      where: { id: account.userId },
      data: { isCorporate: true },
    });

    return NextResponse.json(account);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

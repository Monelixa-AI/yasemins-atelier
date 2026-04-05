import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();

    const group = await prisma.corporatePriceGroup.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(group);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if any accounts use this price group
    const accountCount = await prisma.corporateAccount.count({
      where: { priceGroupId: params.id },
    });

    if (accountCount > 0) {
      return NextResponse.json(
        { error: `Bu fiyat grubunu kullanan ${accountCount} hesap var. Once hesaplarin fiyat grubunu degistirin.` },
        { status: 400 }
      );
    }

    await prisma.corporatePriceGroup.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

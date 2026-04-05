import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName,
      taxNumber,
      taxOffice,
      contactName,
      contactPhone,
      contactEmail,
      invoiceEmail,
      invoiceAddress,
      userId,
      estimatedVolume,
      needs,
    } = body;

    if (!companyName || !contactName || !contactPhone || !contactEmail || !userId) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const existing = await prisma.corporateAccount.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json({ error: "Bu kullanici icin zaten bir basvuru mevcut" }, { status: 409 });
    }

    const account = await prisma.corporateAccount.create({
      data: {
        userId,
        companyName,
        taxNumber,
        taxOffice,
        contactName,
        contactPhone,
        contactEmail,
        invoiceEmail,
        invoiceAddress,
        status: "PENDING",
      },
    });

    return NextResponse.json({ id: account.id, status: account.status }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const corporateId = searchParams.get("corporateId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (corporateId) where.corporateId = corporateId;

    const invoices = await prisma.corporateInvoice.findMany({
      where,
      include: {
        corporate: { select: { id: true, companyName: true, contactEmail: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { corporateId, period, orderIds, subtotal, taxAmount, total, dueDate } =
      await request.json();

    if (!corporateId || !period || !subtotal || !taxAmount || !total) {
      return NextResponse.json({ error: "Zorunlu alanlar eksik" }, { status: 400 });
    }

    const invoiceNo = `CORP-${Date.now()}`;

    const invoice = await prisma.corporateInvoice.create({
      data: {
        corporateId,
        invoiceNo,
        period,
        orders: orderIds || [],
        subtotal,
        taxAmount,
        total,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "DRAFT",
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

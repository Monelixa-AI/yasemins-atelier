import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { month, year } = await request.json();

    if (!month || !year) {
      return NextResponse.json({ error: "month ve year zorunlu" }, { status: 400 });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    const period = `${year}-${String(month).padStart(2, "0")}`;

    const accounts = await prisma.corporateAccount.findMany({
      where: { status: "APPROVED" },
    });

    let generated = 0;

    for (const account of accounts) {
      const orders = await prisma.order.findMany({
        where: {
          corporateAccountId: account.id,
          createdAt: { gte: startDate, lt: endDate },
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
        select: { id: true, total: true },
      });

      if (orders.length === 0) continue;

      const subtotal = orders.reduce((sum, o) => sum + Number(o.total), 0);
      const taxRate = 0.2; // %20 KDV
      const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
      const total = Math.round((subtotal + taxAmount) * 100) / 100;

      const invoiceNo = `CORP-${period}-${account.id.slice(-6).toUpperCase()}`;

      // Skip if invoice already exists for this period
      const existing = await prisma.corporateInvoice.findUnique({ where: { invoiceNo } });
      if (existing) continue;

      await prisma.corporateInvoice.create({
        data: {
          corporateId: account.id,
          invoiceNo,
          period,
          orders: orders.map((o) => o.id),
          subtotal,
          taxAmount,
          total,
          dueDate: new Date(year, month, 0), // Last day of month
          status: "DRAFT",
        },
      });

      generated++;
    }

    return NextResponse.json({ generated });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

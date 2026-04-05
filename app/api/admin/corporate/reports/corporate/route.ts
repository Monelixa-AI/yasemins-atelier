import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalAccounts, pendingApplications, pendingApprovals, monthlyOrders] =
      await Promise.all([
        prisma.corporateAccount.count(),
        prisma.corporateAccount.count({ where: { status: "PENDING" } }),
        prisma.orderApproval.count({ where: { status: "PENDING" } }),
        prisma.order.findMany({
          where: {
            corporateAccountId: { not: null },
            createdAt: { gte: monthStart },
            status: { notIn: ["CANCELLED", "REFUNDED"] },
          },
          select: { total: true },
        }),
      ]);

    const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + Number(o.total), 0);

    return NextResponse.json({
      totalAccounts,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      pendingApplications,
      pendingApprovals,
    });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

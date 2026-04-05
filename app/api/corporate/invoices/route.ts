import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const corporateId = searchParams.get("corporateId");

    if (!corporateId) {
      return NextResponse.json({ error: "corporateId parametresi zorunlu" }, { status: 400 });
    }

    const invoices = await prisma.corporateInvoice.findMany({
      where: { corporateId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invoices });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

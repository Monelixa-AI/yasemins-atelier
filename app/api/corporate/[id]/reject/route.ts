import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { reason, rejectedBy } = await request.json();

    if (!reason) {
      return NextResponse.json({ error: "Red nedeni zorunlu" }, { status: 400 });
    }

    const account = await prisma.corporateAccount.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        rejectedReason: reason,
      },
    });

    return NextResponse.json(account);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

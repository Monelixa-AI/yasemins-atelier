import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { role, maxOrderAmount, isActive } = data;

    const member = await prisma.corporateMember.update({
      where: { id: params.id },
      data: {
        ...(role !== undefined && { role }),
        ...(maxOrderAmount !== undefined && { maxOrderAmount }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json(member);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.corporateMember.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

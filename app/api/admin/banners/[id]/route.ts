import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();

    // Convert date strings to Date objects if present
    if (data.validFrom) data.validFrom = new Date(data.validFrom);
    if (data.validUntil) data.validUntil = new Date(data.validUntil);

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(banner);
  } catch {
    return NextResponse.json({ error: "Banner guncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.banner.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Banner silinemedi" }, { status: 500 });
  }
}

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.startAt) body.startAt = new Date(body.startAt);
    if (body.endAt) body.endAt = new Date(body.endAt);

    const campaign = await prisma.pointsMultiplierCampaign.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error("Loyalty campaign PATCH error:", error);
    return NextResponse.json(
      { error: "Kampanya guncellenemedi" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.pointsMultiplierCampaign.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Loyalty campaign DELETE error:", error);
    return NextResponse.json(
      { error: "Kampanya silinemedi" },
      { status: 500 }
    );
  }
}

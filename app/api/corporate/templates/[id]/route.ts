import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const template = await prisma.orderTemplate.findUnique({ where: { id: params.id } });
    if (!template) {
      return NextResponse.json({ error: "Sablon bulunamadi" }, { status: 404 });
    }
    return NextResponse.json(template);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const template = await prisma.orderTemplate.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(template);
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.orderTemplate.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

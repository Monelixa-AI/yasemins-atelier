import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const movements = await prisma.stockMovement.findMany({ include: { product: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 50 });
    return NextResponse.json(movements);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { productId, type, quantity, note } = await request.json();
    const movement = await prisma.stockMovement.create({ data: { productId, type, quantity, note, createdBy: "admin" } });
    const increment = type === "IN" ? quantity : type === "OUT" ? -quantity : 0;
    if (type !== "ADJUSTMENT") {
      await prisma.product.update({ where: { id: productId }, data: { stockCount: { increment } } });
    }
    return NextResponse.json(movement, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

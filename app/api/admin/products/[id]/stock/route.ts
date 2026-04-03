import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { stockCount, note } = await request.json();
    const product = await prisma.product.update({ where: { id: params.id }, data: { stockCount } });
    await prisma.stockMovement.create({ data: { productId: params.id, type: "ADJUSTMENT", quantity: stockCount, note: note || "Stok düzeltme", createdBy: "admin" } });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

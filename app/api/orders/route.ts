import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, guestEmail, guestPhone, addressId, items, subtotal, deliveryFee, discount, total } = body;

    if (!items?.length || !total) {
      return NextResponse.json({ error: "Sepet boş" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId, guestEmail, guestPhone, addressId,
        subtotal: subtotal || 0, deliveryFee: deliveryFee || 0,
        discount: discount || 0, total,
        items: {
          create: items.map((item: { productId?: string; name: string; price: number; quantity: number; variantName?: string }) => ({
            productId: item.productId, name: item.name, price: item.price,
            quantity: item.quantity, variantName: item.variantName,
            total: item.price * item.quantity,
          })),
        },
        timeline: { create: { status: "PENDING", note: "Sipariş oluşturuldu" } },
      },
      include: { items: true },
    });

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

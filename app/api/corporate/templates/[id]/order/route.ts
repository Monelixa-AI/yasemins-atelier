import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface TemplateItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  try {
    const template = await prisma.orderTemplate.findUnique({
      where: { id: params.id },
      include: { corporate: true },
    });

    if (!template) {
      return NextResponse.json({ error: "Sablon bulunamadi" }, { status: 404 });
    }

    const items = template.items as unknown as TemplateItem[];

    // Fetch products for pricing
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Urun bulunamadi: ${item.productId}`);
      const variant = item.variantId
        ? product.variants.find((v) => v.id === item.variantId)
        : undefined;
      const price = Number(product.basePrice) + (variant ? Number(variant.priceAdd) : 0);
      const total = price * item.quantity;
      subtotal += total;
      return {
        productId: item.productId,
        variantId: item.variantId || null,
        name: product.name,
        variantName: variant?.name || null,
        price,
        quantity: item.quantity,
        total,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: template.corporate.userId,
        corporateAccountId: template.corporateId,
        subtotal,
        total: subtotal,
        status: "PENDING",
        items: { create: orderItems },
      },
    });

    await prisma.orderTemplate.update({
      where: { id: params.id },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

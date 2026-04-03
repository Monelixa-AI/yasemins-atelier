import { prisma } from "@/lib/db";

interface CreateOrderData {
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  addressId?: string;
  items: {
    productId: string;
    variantId?: string;
    bundleId?: string;
    name: string;
    variantName?: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export async function createOrder(data: CreateOrderData) {
  try {
    return await prisma.order.create({
      data: {
        userId: data.userId,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        addressId: data.addressId,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        discount: data.discount,
        total: data.total,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            bundleId: item.bundleId,
            name: item.name,
            variantName: item.variantName,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        },
        timeline: {
          create: { status: "PENDING", note: "Sipariş oluşturuldu" },
        },
      },
      include: { items: true },
    });
  } catch {
    return null;
  }
}

export async function getOrderById(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      include: { items: true, timeline: { orderBy: { createdAt: "desc" } } },
    });
  } catch {
    return null;
  }
}

export async function getOrdersByUser(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

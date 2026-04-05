import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sendOrderStatusUpdate } from "@/lib/email";
import { sendSMS, SMS_TEMPLATES } from "@/lib/sms";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        timeline: { orderBy: { createdAt: "desc" } },
        payments: true,
        user: true,
        address: true,
        zone: true,
        slot: true,
        invoice: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order detail API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, adminNote, paymentMethod } = body;

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (adminNote !== undefined) updateData.adminNote = adminNote;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: true,
        timeline: { orderBy: { createdAt: "desc" } },
        payments: true,
        user: true,
        address: true,
        zone: true,
        slot: true,
        invoice: true,
      },
    });

    // Create timeline entry on status change
    if (status && status !== existing.status) {
      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status,
          note: adminNote || `Status changed from ${existing.status} to ${status}`,
          createdBy: "admin",
        },
      });
    }

    // Send notifications on status change
    if (status) {
      const updatedOrder = await prisma.order.findUnique({
        where: { id: params.id },
        include: { items: true, address: true, user: true },
      })
      if (updatedOrder) {
        const phone = updatedOrder.address?.phone || updatedOrder.user?.phone || updatedOrder.guestPhone
        if (status === "OUT_FOR_DELIVERY" || status === "DELIVERED") {
          sendOrderStatusUpdate(updatedOrder, status).catch(console.error)
        }
        if (status === "OUT_FOR_DELIVERY" && phone) {
          sendSMS(phone, SMS_TEMPLATES.orderOutForDelivery(updatedOrder.orderNumber)).catch(console.error)
        }
        if (status === "DELIVERED" && phone) {
          sendSMS(phone, SMS_TEMPLATES.orderDelivered(updatedOrder.orderNumber)).catch(console.error)
        }
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order update API error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

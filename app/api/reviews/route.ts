import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { awardPoints } from "@/lib/loyalty";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, userId, rating, title, body: reviewBody } = body;

    if (!productId || !userId || !rating || !reviewBody) {
      return NextResponse.json(
        { error: "productId, userId, rating ve body zorunludur" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating 1-5 arasında olmalıdır" },
        { status: 400 }
      );
    }

    // Verify user has a completed order with this product
    const purchasedOrder = await prisma.order.findFirst({
      where: {
        userId,
        OR: [
          { status: "DELIVERED" },
          { paymentStatus: "PAID" },
        ],
        items: {
          some: { productId },
        },
      },
      select: { id: true },
    });

    if (!purchasedOrder) {
      return NextResponse.json(
        { error: "Bu ürünü satın almadan yorum yapamazsınız" },
        { status: 403 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        title: title || null,
        body: reviewBody,
        status: "PENDING",
      },
    });

    // Try to award bonus points for writing a review
    try {
      await awardPoints(userId, 10, "REVIEW", "Yorum yazma bonusu");
    } catch {
      // Loyalty system might be disabled — silently continue
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Review POST hatası:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Ürün bulunamadı" },
        { status: 404 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId: product.id,
        status: "APPROVED",
      },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: {
        user: { select: { name: true } },
      },
    });

    // Calculate rating distribution
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let ratingSum = 0;

    for (const review of reviews) {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
      ratingSum += review.rating;
    }

    const totalCount = reviews.length;
    const avgRating =
      totalCount > 0 ? Math.round((ratingSum / totalCount) * 100) / 100 : 0;

    return NextResponse.json({
      reviews,
      avgRating,
      totalCount,
      distribution,
    });
  } catch (error) {
    console.error("Product reviews GET hatası:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

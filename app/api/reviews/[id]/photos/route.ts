import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { awardPoints } from "@/lib/loyalty";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "url zorunludur" },
        { status: 400 }
      );
    }

    // Get current review to check existing images
    const existing = await prisma.review.findUnique({
      where: { id },
      select: { images: true, userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Yorum bulunamadı" },
        { status: 404 }
      );
    }

    const isFirstPhoto = existing.images.length === 0;

    // Append url to the existing images array
    const review = await prisma.review.update({
      where: { id },
      data: {
        images: { push: url },
      },
    });

    // Award photo review bonus only if this is the first photo
    if (isFirstPhoto) {
      try {
        await awardPoints(
          existing.userId,
          20,
          "PHOTO_REVIEW",
          "Fotoğraflı yorum bonusu"
        );
      } catch {
        // Loyalty system might be disabled — silently continue
      }
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review photos POST hatası:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

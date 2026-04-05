import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const review = await prisma.review.update({
      where: { id },
      data: { helpfulCount: { increment: 1 } },
      select: { id: true, helpfulCount: true },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review helpful POST hatası:", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

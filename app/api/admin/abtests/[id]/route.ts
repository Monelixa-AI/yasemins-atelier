import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existing = await prisma.aBTest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "AB test not found" },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) {
      updateData.status = body.status;
    }
    if (body.name !== undefined) {
      updateData.name = body.name;
    }
    if (body.description !== undefined) {
      updateData.description = body.description;
    }
    if (body.startAt !== undefined) {
      updateData.startAt = body.startAt;
    }
    if (body.endAt !== undefined) {
      updateData.endAt = body.endAt;
    }
    if (body.winnerVariantId !== undefined) {
      updateData.winnerVariantId = body.winnerVariantId;
      // Mark test as completed when a winner is set
      if (body.winnerVariantId) {
        updateData.status = "COMPLETED";
      }
    }

    const test = await prisma.aBTest.update({
      where: { id },
      data: updateData,
      include: {
        variants: {
          orderBy: { name: "asc" },
        },
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error("AB test update API error:", error);
    return NextResponse.json(
      { error: "Failed to update AB test" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existing = await prisma.aBTest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "AB test not found" },
        { status: 404 }
      );
    }

    await prisma.aBTest.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("AB test delete API error:", error);
    return NextResponse.json(
      { error: "Failed to delete AB test" },
      { status: 500 }
    );
  }
}

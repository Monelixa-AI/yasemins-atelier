import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

function generateAffiliateCode(name: string): string {
  const prefix = name
    .replace(/[^a-zA-ZığüşöçİĞÜŞÖÇ]/g, "")
    .toUpperCase()
    .slice(0, 4);

  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `${prefix}${random}`;
}

export async function GET() {
  try {
    const affiliates = await prisma.affiliate.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        discountCode: {
          select: {
            id: true,
            code: true,
            type: true,
            value: true,
            usedCount: true,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json(affiliates);
  } catch (error) {
    console.error("Affiliates list API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch affiliates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, instagramHandle, tiktokHandle, commissionRate } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if affiliate already exists
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { email },
    });
    if (existingAffiliate) {
      return NextResponse.json(
        { error: "Bu e-posta ile zaten bir affiliate kaydi var" },
        { status: 409 }
      );
    }

    // Generate unique discount code
    let code: string;
    let codeExists = true;
    do {
      code = generateAffiliateCode(name);
      const existing = await prisma.discountCode.findUnique({
        where: { code },
      });
      codeExists = !!existing;
    } while (codeExists);

    // Create discount code + affiliate in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create discount code: 10% PERCENTAGE
      const discountCode = await tx.discountCode.create({
        data: {
          code,
          type: "PERCENTAGE",
          value: 10,
          isActive: true,
        },
      });

      // Create affiliate linked to the discount code
      const affiliate = await tx.affiliate.create({
        data: {
          name,
          email,
          instagramHandle: instagramHandle || null,
          tiktokHandle: tiktokHandle || null,
          commissionRate: commissionRate ?? 0.1,
          discountCodeId: discountCode.id,
        },
        include: {
          discountCode: {
            select: {
              id: true,
              code: true,
              type: true,
              value: true,
              usedCount: true,
              isActive: true,
            },
          },
        },
      });

      return affiliate;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Affiliate create API error:", error);
    return NextResponse.json(
      { error: "Failed to create affiliate" },
      { status: 500 }
    );
  }
}

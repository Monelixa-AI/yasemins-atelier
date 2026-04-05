import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    const where: Prisma.DiscountCodeWhereInput = {};

    if (isActive !== null && isActive !== undefined && isActive !== "") {
      where.isActive = isActive === "true";
    }
    if (search) {
      where.code = { contains: search, mode: "insensitive" };
    }

    const codes = await prisma.discountCode.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error("Discount codes list API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch discount codes" },
      { status: 500 }
    );
  }
}

function generateCode(prefix: string, length: number = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = prefix ? `${prefix}-` : "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Bulk creation mode
    if (body.bulk === true) {
      const { count = 10, prefix = "", ...codeData } = body;
      delete codeData.bulk;

      const codes: { code: string }[] = [];
      const existingCodes = new Set(
        (await prisma.discountCode.findMany({ select: { code: true } })).map(
          (c) => c.code
        )
      );

      for (let i = 0; i < count; i++) {
        let code: string;
        do {
          code = generateCode(prefix);
        } while (existingCodes.has(code));
        existingCodes.add(code);
        codes.push({ code });
      }

      const created = await prisma.$transaction(
        codes.map((c) =>
          prisma.discountCode.create({
            data: { ...codeData, ...c },
          })
        )
      );

      return NextResponse.json(created, { status: 201 });
    }

    // Single creation
    const code = await prisma.discountCode.create({
      data: body,
    });

    return NextResponse.json(code, { status: 201 });
  } catch (error) {
    console.error("Discount code create API error:", error);
    return NextResponse.json(
      { error: "Failed to create discount code" },
      { status: 500 }
    );
  }
}

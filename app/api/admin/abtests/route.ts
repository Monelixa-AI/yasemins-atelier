import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tests = await prisma.aBTest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        variants: {
          orderBy: { name: "asc" },
        },
      },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("AB tests list API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch AB tests" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variants, ...testData } = body;

    // Default to 2 variants if none provided
    const variantData =
      variants && variants.length > 0
        ? variants
        : [
            { name: "Kontrol (A)", weight: 50, config: {} },
            { name: "Varyant (B)", weight: 50, config: {} },
          ];

    const test = await prisma.aBTest.create({
      data: {
        ...testData,
        variants: {
          create: variantData.map(
            (v: { name: string; weight?: number; config?: object }) => ({
              name: v.name,
              weight: v.weight ?? 50,
              config: v.config ?? {},
            })
          ),
        },
      },
      include: {
        variants: {
          orderBy: { name: "asc" },
        },
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error("AB test create API error:", error);
    return NextResponse.json(
      { error: "Failed to create AB test" },
      { status: 500 }
    );
  }
}

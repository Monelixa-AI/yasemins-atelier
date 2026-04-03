import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ products: [], posts: [] });
    }

    const [products, posts] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { shortDesc: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { images: true, category: true },
        take: 5,
      }),
      prisma.blogPost.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 3,
      }),
    ]);

    return NextResponse.json({ products, posts });
  } catch {
    return NextResponse.json({ products: [], posts: [] });
  }
}

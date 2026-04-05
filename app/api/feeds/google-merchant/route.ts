import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const revalidate = 21600; // 6 hours

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://yaseminsatelier.com";

    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        category: {
          select: { name: true },
        },
      },
    });

    const items = products
      .map((product) => {
        const imageUrl = product.images[0]?.url || "";
        const price = Number(product.basePrice).toFixed(2);
        const availability =
          product.stockCount !== null && product.stockCount <= 0
            ? "out of stock"
            : "in stock";
        const description = (product.shortDesc || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
        const title = product.name
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");

        return `    <item>
      <g:id>${product.id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${baseUrl}/urun/${product.slug}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:price>${price} TRY</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Yasemin's Atelier</g:brand>
      <g:product_type>${product.category?.name || "Gastronomi"}</g:product_type>
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Yasemin's Atelier</title>
    <link>${baseUrl}</link>
    <description>Gastronomi Sanati - Istanbul El Yapimi</description>
${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=21600",
      },
    });
  } catch (error) {
    console.error("Google Merchant feed error:", error);
    return new NextResponse("<error>Feed generation failed</error>", {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SERVICE_SLUGS = [
  "eve-sef",
  "davet-organizasyon",
  "ofis-yemek",
  "workshop",
  "lezzet-kutusu",
];

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://yaseminsatelier.com";

  const [products, blogPosts, occasions] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.occasion.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/naturel", priority: "0.9", changefreq: "weekly" },
    { loc: "/menu", priority: "0.9", changefreq: "weekly" },
    { loc: "/occasions", priority: "0.8", changefreq: "weekly" },
    { loc: "/atelier", priority: "0.7", changefreq: "monthly" },
    { loc: "/journal", priority: "0.8", changefreq: "daily" },
    { loc: "/hizmetler", priority: "0.8", changefreq: "weekly" },
    { loc: "/paketler", priority: "0.8", changefreq: "weekly" },
    { loc: "/naturel/urunler", priority: "0.8", changefreq: "weekly" },
  ];

  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
${products
  .map(
    (p) => `  <url>
    <loc>${baseUrl}/urunler/${p.slug}</loc>
    <lastmod>${p.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
${blogPosts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/journal/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
${occasions
  .map(
    (o) => `  <url>
    <loc>${baseUrl}/occasions/${o.slug.toLowerCase().replace(/_/g, "-")}</loc>
    <lastmod>${o.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
${SERVICE_SLUGS.map(
  (slug) => `  <url>
    <loc>${baseUrl}/hizmetler/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}

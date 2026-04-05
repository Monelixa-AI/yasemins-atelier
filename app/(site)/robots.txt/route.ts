import { NextResponse } from "next/server";

export function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yaseminsatelier.com";

  const robotsTxt = `# Yasemin's Atelier - Robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Allow: /api/feeds/
Disallow: /checkout
Disallow: /hesabim

Crawl-delay: 1

Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}

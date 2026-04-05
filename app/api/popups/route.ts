import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "/";
    const device = searchParams.get("device") || "desktop";

    const now = new Date();

    const popups = await prisma.popup.findMany({
      where: {
        isActive: true,
        OR: [{ validFrom: null }, { validFrom: { lte: now } }],
        AND: [
          { OR: [{ validUntil: null }, { validUntil: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    // Filter by page and device in application layer (Prisma array filtering is limited)
    const filtered = popups.filter((popup) => {
      // Page filter: show if showOnPages is empty (all pages) or includes the page
      const pageMatch =
        popup.showOnPages.length === 0 || popup.showOnPages.some((p) => page.startsWith(p));

      // Exclude pages
      const notExcluded =
        popup.excludePages.length === 0 || !popup.excludePages.some((p) => page.startsWith(p));

      // Device filter: show if showOnDevices is empty (all devices) or includes the device
      const deviceMatch =
        popup.showOnDevices.length === 0 || popup.showOnDevices.includes(device);

      return pageMatch && notExcluded && deviceMatch;
    });

    return NextResponse.json({ popups: filtered });
  } catch {
    return NextResponse.json({ error: "Popup verisi alinamadi" }, { status: 500 });
  }
}

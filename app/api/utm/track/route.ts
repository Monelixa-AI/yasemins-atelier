import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  try {
    const { source, medium, campaign, term, content, landingPage } = await request.json();

    if (!landingPage) {
      return NextResponse.json({ error: "landingPage gerekli" }, { status: 400 });
    }

    const sessionId = randomUUID();

    await prisma.uTMClick.create({
      data: {
        source: source || null,
        medium: medium || null,
        campaign: campaign || null,
        term: term || null,
        content: content || null,
        landingPage,
        sessionId,
      },
    });

    return NextResponse.json({ sessionId });
  } catch {
    return NextResponse.json({ error: "UTM verisi kaydedilemedi" }, { status: 500 });
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error("Admin campaigns GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        status: body.status || "DRAFT",
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        description: body.description,
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
      },
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error("Admin campaigns POST hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const policies = await prisma.policyVersion.findMany({
      orderBy: [{ policyType: "asc" }, { createdAt: "desc" }],
    })

    // Group by policyType
    const grouped: Record<string, typeof policies> = {}
    for (const policy of policies) {
      if (!grouped[policy.policyType]) {
        grouped[policy.policyType] = []
      }
      grouped[policy.policyType].push(policy)
    }

    return NextResponse.json({ policies: grouped })
  } catch (error) {
    console.error("Admin policies GET hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { policyType, version, content, summary } = body

    if (!policyType || !version || !content) {
      return NextResponse.json(
        { error: "policyType, version ve content gerekli" },
        { status: 400 }
      )
    }

    // Deactivate previous active version of same type
    await prisma.policyVersion.updateMany({
      where: { policyType, isActive: true },
      data: { isActive: false },
    })

    const policy = await prisma.policyVersion.create({
      data: {
        policyType,
        version,
        content,
        summary: summary || null,
        isActive: true,
        publishedAt: new Date(),
      },
    })

    return NextResponse.json({ policy }, { status: 201 })
  } catch (error) {
    console.error("Admin policies POST hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

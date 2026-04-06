import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { processDataDeletion } from "@/lib/legal/data-subject-rights"

export async function GET() {
  try {
    const requests = await prisma.dataDeletionRequest.findMany({
      orderBy: { requestedAt: "desc" },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Admin deletion-requests GET hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status, processedBy } = body

    if (!id || !status) {
      return NextResponse.json(
        { error: "id ve status gerekli" },
        { status: 400 }
      )
    }

    if (status === "COMPLETED") {
      if (!processedBy) {
        return NextResponse.json(
          { error: "processedBy gerekli" },
          { status: 400 }
        )
      }

      const result = await processDataDeletion(id, processedBy)
      return NextResponse.json({ success: true, ...result })
    }

    if (status === "REJECTED") {
      await prisma.dataDeletionRequest.update({
        where: { id },
        data: {
          status: "REJECTED",
          processedAt: new Date(),
          processedBy: processedBy || "admin",
        },
      })
      return NextResponse.json({ success: true })
    }

    if (status === "IN_PROGRESS") {
      await prisma.dataDeletionRequest.update({
        where: { id },
        data: { status: "IN_PROGRESS" },
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: "Gecersiz status degeri" },
      { status: 400 }
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bir hata olustu"
    console.error("Admin deletion-requests PATCH hatasi:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

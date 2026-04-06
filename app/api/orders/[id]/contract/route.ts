import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const contract = await prisma.salesContract.findUnique({
      where: { orderId: id },
    })

    if (!contract) {
      return NextResponse.json(
        { error: "Sozlesme bulunamadi" },
        { status: 404 }
      )
    }

    return NextResponse.json({ contract })
  } catch (error) {
    console.error("Contract GET hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

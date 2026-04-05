import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            items: true,
          },
        },
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        wishlistItems: {
          include: {
            product: { select: { id: true, name: true, slug: true, basePrice: true } },
          },
        },
        loyaltyTxns: {
          orderBy: { createdAt: "desc" },
        },
        crmNotes: {
          orderBy: { createdAt: "desc" },
        },
        tags: true,
        segments: true,
        addresses: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Admin customer GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

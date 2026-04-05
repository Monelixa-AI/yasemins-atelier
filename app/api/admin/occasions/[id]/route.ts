import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const data: Record<string, unknown> = {}

    if (body.name !== undefined) data.name = body.name
    if (body.description !== undefined) data.description = body.description
    if (body.longDesc !== undefined) data.longDesc = body.longDesc
    if (body.imageUrl !== undefined) data.imageUrl = body.imageUrl
    if (body.colorTheme !== undefined) data.colorTheme = body.colorTheme
    if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder
    if (body.isActive !== undefined) data.isActive = body.isActive
    if (body.metaTitle !== undefined) data.metaTitle = body.metaTitle
    if (body.metaDesc !== undefined) data.metaDesc = body.metaDesc

    const occasion = await prisma.occasion.update({
      where: { id: params.id },
      data,
    })

    // Handle product assignment if productIds provided
    if (body.productIds !== undefined) {
      // Delete existing OccasionProduct records
      await prisma.occasionProduct.deleteMany({
        where: { occasionId: params.id },
      })

      // Create new OccasionProduct records
      if (body.productIds.length > 0) {
        await prisma.occasionProduct.createMany({
          data: body.productIds.map((productId: string, index: number) => ({
            occasionId: params.id,
            productId,
            sortOrder: index,
          })),
        })
      }
    }

    // Return occasion with updated products
    const updated = await prisma.occasion.findUnique({
      where: { id: params.id },
      include: { products: { include: { product: true }, orderBy: { sortOrder: "asc" } } },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Admin occasions PATCH hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

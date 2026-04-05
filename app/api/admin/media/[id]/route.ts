import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { unlink } from "fs/promises"
import path from "path"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const media = await prisma.mediaLibrary.update({
      where: { id: params.id },
      data: { altText: body.altText },
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error("Admin media PATCH hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const media = await prisma.mediaLibrary.findUnique({
      where: { id: params.id },
    })

    if (!media) {
      return NextResponse.json({ error: "Medya bulunamadı" }, { status: 404 })
    }

    // Remove file from disk
    const filePath = path.join(process.cwd(), "public", media.url)
    try {
      await unlink(filePath)
    } catch {
      // File may already be deleted, continue with DB cleanup
      console.warn(`Dosya silinemedi: ${filePath}`)
    }

    // Remove DB record
    await prisma.mediaLibrary.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin media DELETE hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const mimeType = searchParams.get("mimeType")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: Prisma.MediaLibraryWhereInput = {}

    if (mimeType) {
      where.mimeType = { startsWith: mimeType }
    }

    if (search) {
      where.OR = [
        { filename: { contains: search, mode: "insensitive" } },
        { altText: { contains: search, mode: "insensitive" } },
      ]
    }

    const [media, total] = await Promise.all([
      prisma.mediaLibrary.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.mediaLibrary.count({ where }),
    ])

    return NextResponse.json({
      media,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Admin media GET hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const ext = path.extname(file.name)
    const uniqueName = `${randomUUID()}${ext}`

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    // Write file to disk
    const filePath = path.join(uploadsDir, uniqueName)
    await writeFile(filePath, buffer)

    // Create DB record
    const media = await prisma.mediaLibrary.create({
      data: {
        url: `/uploads/${uniqueName}`,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: buffer.length,
        altText: (formData.get("altText") as string) || null,
        width: formData.get("width") ? parseInt(formData.get("width") as string) : null,
        height: formData.get("height") ? parseInt(formData.get("height") as string) : null,
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error("Admin media POST hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}

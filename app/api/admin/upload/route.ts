import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { uploadToR2 } from "@/lib/r2";

const USE_R2 = !!process.env.CLOUDFLARE_R2_ENDPOINT;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = path.extname(file.name) || "";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

    // R2 varsa buluta yukle, yoksa lokale yaz
    if (USE_R2) {
      const key = `uploads/${uniqueName}`;
      const contentType = file.type || "application/octet-stream";
      const url = await uploadToR2(key, buffer, contentType);
      return NextResponse.json({ url });
    }

    // Lokal fallback (gelistirme ortami)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, uniqueName);
    await writeFile(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${uniqueName}` });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

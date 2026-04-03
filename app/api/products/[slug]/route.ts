import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/queries/products";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await getProductBySlug(params.slug);
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

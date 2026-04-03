import { NextResponse } from "next/server";
import { getProducts } from "@/lib/queries/products";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await getProducts({
      category: searchParams.get("category") ?? undefined,
      occasion: searchParams.get("occasion") ?? undefined,
      featured: searchParams.get("featured") === "true",
      search: searchParams.get("search") ?? undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 12,
      sort: searchParams.get("sort") ?? undefined,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

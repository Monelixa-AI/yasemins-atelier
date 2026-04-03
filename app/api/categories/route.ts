import { NextResponse } from "next/server";
import { getCategories } from "@/lib/queries/categories";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

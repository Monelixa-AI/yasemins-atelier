import { NextResponse } from "next/server";
import { calculateShipping } from "@/lib/utils/shipping";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "İstanbul";
  const weight = Number(searchParams.get("weight")) || 500;
  const subtotal = Number(searchParams.get("subtotal")) || 0;
  const options = calculateShipping(weight, city, subtotal);
  return NextResponse.json({ options });
}

import { NextResponse } from "next/server";
import { generateOrderTemplate } from "@/lib/csv";

export async function GET() {
  const csv = generateOrderTemplate();

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="toplu-siparis-sablonu.csv"',
    },
  });
}

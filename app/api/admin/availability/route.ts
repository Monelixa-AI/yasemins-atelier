import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const rules = await prisma.availabilityRule.findMany({ orderBy: [{ serviceSlug: "asc" }, { dayOfWeek: "asc" }] });
    return NextResponse.json(rules);
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rule = await prisma.availabilityRule.create({ data: body });
    return NextResponse.json(rule, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

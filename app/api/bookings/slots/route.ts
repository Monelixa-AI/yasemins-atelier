import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/utils/slots";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");
    const dateStr = searchParams.get("date");

    if (!service || !dateStr) {
      return NextResponse.json({ error: "service ve date gerekli" }, { status: 400 });
    }

    const slots = await getAvailableSlots(service, new Date(dateStr));
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

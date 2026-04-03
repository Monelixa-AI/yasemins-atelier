import { NextResponse } from "next/server";
import { getAvailableDates } from "@/lib/utils/slots";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");
    const year = Number(searchParams.get("year"));
    const month = Number(searchParams.get("month"));

    if (!service || !year || !month) {
      return NextResponse.json({ error: "service, year, month gerekli" }, { status: 400 });
    }

    const dates = await getAvailableDates(service, year, month);
    return NextResponse.json({ dates });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

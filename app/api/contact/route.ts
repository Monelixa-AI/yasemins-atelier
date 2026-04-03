import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Randevu talebi:", body);
    return NextResponse.json({ message: "Talebiniz alındı!" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

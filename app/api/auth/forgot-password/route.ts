import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    console.log("Password reset requested for:", email);
    // Always return success for security (don't reveal if email exists)
    return NextResponse.json({ success: true, message: "Şifre sıfırlama bağlantısı gönderildi." });
  } catch {
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}

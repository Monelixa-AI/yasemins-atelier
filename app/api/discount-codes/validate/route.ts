import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code, orderTotal } = await request.json();
    if (!code) return NextResponse.json({ valid: false, message: "Kod gerekli" });

    const discount = await prisma.discountCode.findUnique({ where: { code: code.toUpperCase() } });
    if (!discount || !discount.isActive) {
      return NextResponse.json({ valid: false, message: "Geçersiz kod" });
    }
    if (discount.validUntil && new Date() > discount.validUntil) {
      return NextResponse.json({ valid: false, message: "Kodun süresi dolmuş" });
    }
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return NextResponse.json({ valid: false, message: "Kod kullanım limitine ulaştı" });
    }
    if (discount.minOrderAmount && orderTotal < Number(discount.minOrderAmount)) {
      return NextResponse.json({ valid: false, message: `Minimum sipariş tutarı: ${discount.minOrderAmount}₺` });
    }

    let discountAmount = 0;
    if (discount.type === "PERCENTAGE") discountAmount = orderTotal * (Number(discount.value) / 100);
    else if (discount.type === "FIXED_AMOUNT") discountAmount = Number(discount.value);

    return NextResponse.json({ valid: true, discount: discountAmount, type: discount.type, message: "İndirim uygulandı!" });
  } catch {
    return NextResponse.json({ valid: false, message: "Bir hata oluştu" });
  }
}

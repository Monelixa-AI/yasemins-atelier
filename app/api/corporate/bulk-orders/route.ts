import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const corporateId = searchParams.get("corporateId");

    if (!corporateId) {
      return NextResponse.json({ error: "corporateId parametresi zorunlu" }, { status: 400 });
    }

    const bulkOrders = await prisma.bulkOrder.findMany({
      where: { corporateId },
      include: { _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ bulkOrders });
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

interface CsvRow {
  alici_adi: string;
  alici_telefon: string;
  teslimat_adresi: string;
  ilce: string;
  urun_kodu_1?: string;
  miktar_1?: number;
  urun_kodu_2?: string;
  miktar_2?: number;
  notlar?: string;
}

export async function POST(request: Request) {
  try {
    const { corporateId, name, csvData, deliveryDate } = await request.json();

    if (!corporateId || !name || !csvData || !Array.isArray(csvData)) {
      return NextResponse.json({ error: "corporateId, name ve csvData zorunlu" }, { status: 400 });
    }

    const account = await prisma.corporateAccount.findUnique({
      where: { id: corporateId },
    });
    if (!account) {
      return NextResponse.json({ error: "Kurumsal hesap bulunamadi" }, { status: 404 });
    }

    let successCount = 0;
    let errorCount = 0;
    let totalAmount = 0;
    const errors: { row: number; error: string }[] = [];
    const orderIds: string[] = [];

    // Collect all product slugs/ids from csvData
    const allProductCodes = new Set<string>();
    for (const row of csvData as CsvRow[]) {
      if (row.urun_kodu_1) allProductCodes.add(row.urun_kodu_1);
      if (row.urun_kodu_2) allProductCodes.add(row.urun_kodu_2);
    }

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: Array.from(allProductCodes) } },
          { slug: { in: Array.from(allProductCodes) } },
        ],
      },
    });
    const productBySlug = new Map(products.map((p) => [p.slug, p]));
    const productById = new Map(products.map((p) => [p.id, p]));

    const findProduct = (code: string) => productById.get(code) || productBySlug.get(code);

    for (let i = 0; i < (csvData as CsvRow[]).length; i++) {
      const row = (csvData as CsvRow[])[i];
      try {
        const items: { productId: string; name: string; price: number; quantity: number; total: number }[] = [];

        if (row.urun_kodu_1) {
          const p = findProduct(row.urun_kodu_1);
          if (!p) throw new Error(`Urun bulunamadi: ${row.urun_kodu_1}`);
          const qty = Number(row.miktar_1) || 1;
          const price = Number(p.basePrice);
          items.push({ productId: p.id, name: p.name, price, quantity: qty, total: price * qty });
        }

        if (row.urun_kodu_2) {
          const p = findProduct(row.urun_kodu_2);
          if (!p) throw new Error(`Urun bulunamadi: ${row.urun_kodu_2}`);
          const qty = Number(row.miktar_2) || 1;
          const price = Number(p.basePrice);
          items.push({ productId: p.id, name: p.name, price, quantity: qty, total: price * qty });
        }

        if (items.length === 0) throw new Error("En az bir urun kodu gerekli");

        const subtotal = items.reduce((s, it) => s + it.total, 0);

        const order = await prisma.order.create({
          data: {
            userId: account.userId,
            corporateAccountId: corporateId,
            guestPhone: row.alici_telefon,
            giftNote: row.notlar || null,
            subtotal,
            total: subtotal,
            deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
            status: "PENDING",
            items: { create: items },
          },
        });

        orderIds.push(order.id);
        totalAmount += subtotal;
        successCount++;
      } catch (err) {
        errorCount++;
        errors.push({ row: i + 1, error: err instanceof Error ? err.message : "Bilinmeyen hata" });
      }
    }

    const bulkOrder = await prisma.bulkOrder.create({
      data: {
        corporateId,
        name,
        csvData,
        totalAmount,
        status: errorCount === 0 ? "COMPLETED" : successCount === 0 ? "FAILED" : "PARTIAL",
        errorLog: errors.length > 0 ? errors : undefined,
        orders: { connect: orderIds.map((id) => ({ id })) },
      },
    });

    return NextResponse.json(
      { bulkOrderId: bulkOrder.id, successCount, errorCount, totalAmount },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

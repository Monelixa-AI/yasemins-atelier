import { prisma } from "@/lib/db";
import type { Report, MetricCard, ChartData, TableRow, ReportFilter } from "./types";

export async function getStockReport(): Promise<Report> {
  // Naturel products (physical, shippable) with stock tracking
  const products = await prisma.product.findMany({
    where: { isNaturel: true },
    select: {
      id: true,
      name: true,
      status: true,
      stockCount: true,
      lowStockAlert: true,
      basePrice: true,
      costPrice: true,
      category: { select: { name: true } },
    },
  });

  let totalStock = 0;
  let totalStockValue = 0; // based on basePrice
  let totalCostValue = 0; // based on costPrice
  let outOfStockCount = 0;
  let lowStockCount = 0;
  let activeCount = 0;

  const table: TableRow[] = [];

  for (const p of products) {
    const stock = p.stockCount ?? 0;
    const threshold = p.lowStockAlert ?? 5;
    const price = Number(p.basePrice);
    const cost = Number(p.costPrice ?? 0);

    totalStock += stock;
    totalStockValue += stock * price;
    totalCostValue += stock * cost;

    if (stock === 0) outOfStockCount++;
    else if (stock <= threshold) lowStockCount++;

    if (p.status === "ACTIVE") activeCount++;

    let stockStatus: string;
    if (stock === 0) stockStatus = "Tukenmis";
    else if (stock <= threshold) stockStatus = "Dusuk Stok";
    else stockStatus = "Yeterli";

    table.push({
      productId: p.id,
      name: p.name,
      category: p.category?.name ?? "-",
      status: p.status,
      stockCount: stock,
      lowStockAlert: threshold,
      stockStatus,
      stockValue: Math.round(stock * price * 100) / 100,
      costValue: Math.round(stock * cost * 100) / 100,
    });
  }

  // Sort: out of stock first, then low stock, then by stock count ascending
  table.sort((a, b) => {
    const order: Record<string, number> = { Tukenmis: 0, "Dusuk Stok": 1, Yeterli: 2 };
    const diff = (order[a.stockStatus] ?? 3) - (order[b.stockStatus] ?? 3);
    if (diff !== 0) return diff;
    return (a.stockCount as number) - (b.stockCount as number);
  });

  const metrics: MetricCard[] = [
    { label: "Toplam Urun", value: products.length, format: "number" },
    { label: "Aktif Urun", value: activeCount, format: "number" },
    { label: "Toplam Stok Adedi", value: totalStock, format: "number" },
    { label: "Stok Degeri (Satis)", value: Math.round(totalStockValue * 100) / 100, format: "currency" },
    { label: "Stok Degeri (Maliyet)", value: Math.round(totalCostValue * 100) / 100, format: "currency" },
    { label: "Dusuk Stok", value: lowStockCount, format: "number" },
    { label: "Tukenmis", value: outOfStockCount, format: "number" },
  ];

  const stockChart: ChartData = {
    labels: ["Yeterli", "Dusuk Stok", "Tukenmis"],
    datasets: [
      {
        label: "Urun Sayisi",
        data: [
          products.length - lowStockCount - outOfStockCount,
          lowStockCount,
          outOfStockCount,
        ],
      },
    ],
  };

  // Use a neutral filter since this is a snapshot report
  const dummyFilter: ReportFilter = {
    dateRange: { from: new Date(), to: new Date() },
  };

  return {
    title: "Stok Raporu (Naturel)",
    generatedAt: new Date(),
    filters: dummyFilter,
    metrics,
    charts: [stockChart],
    table,
  };
}

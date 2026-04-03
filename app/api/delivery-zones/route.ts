import { NextResponse } from "next/server";

const zones: Record<string, { fee: number; freeThreshold: number }> = {
  "kadikoy": { fee: 50, freeThreshold: 500 },
  "besiktas": { fee: 50, freeThreshold: 500 },
  "uskudar": { fee: 50, freeThreshold: 500 },
  "sisli": { fee: 60, freeThreshold: 500 },
  "beyoglu": { fee: 60, freeThreshold: 500 },
  "atasehir": { fee: 50, freeThreshold: 500 },
  "maltepe": { fee: 60, freeThreshold: 600 },
  "bakirköy": { fee: 70, freeThreshold: 600 },
  "sariyer": { fee: 80, freeThreshold: 700 },
  "default": { fee: 80, freeThreshold: 700 },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district")?.toLowerCase().replace(/ö/g, "o").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ç/g, "c").replace(/ı/g, "i").replace(/ğ/g, "g") || "default";
  const zone = zones[district] || zones["default"];
  return NextResponse.json({ ...zone, isAvailable: true });
}

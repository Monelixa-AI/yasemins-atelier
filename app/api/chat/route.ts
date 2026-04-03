import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { products } from "@/lib/data/products";
import { services } from "@/lib/data/services";

const SYSTEM_PROMPT = `Sen Yasemin's Atelier'in dijital asistanısın. Yasemin, İstanbul'da premium gastronomi hizmetleri ve el yapımı yemekler sunan bir şeftir.

KİŞİLİĞİN: Sıcak, samimi, profesyonel Türkçe. Kısa ve net (max 3-4 cümle). Emoji kullanabilirsin ama abartma.

ÜRÜNLER: ${products.slice(0, 10).map((p) => `${p.name}: ${p.basePrice}₺ - ${p.shortDesc}`).join(" | ")}

HİZMETLER: ${services.map((s) => `${s.name}: ${s.tagline}`).join(" | ")}

TESLİMAT: İstanbul geneli, 24 saat öncesi sipariş, 50₺ teslimat (500₺ üzeri ücretsiz), 10:00-21:00.
BOOKING: Eve Şef, Workshop vb. için rezervasyon sistemi var. Depozito ile rezervasyon.

YAPMAN GEREKENLER: Occasion'a göre ürün öner, fiyat bilgisi ver (₺), allerjen bilgisi ver, sipariş için Menü veya Sofra Danışmanı öner.
YAPMAMAN GEREKENLER: Fiyat pazarlığı yapma, 100+ kelime yanıt verme, rakiplerden bahsetme.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    if (!messages?.length) {
      return NextResponse.json({ error: "Mesaj gerekli" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "Şu an asistanımız müsait değil. WhatsApp'tan bize ulaşabilirsiniz! 📱" });
    }

    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({ role: m.role as "user" | "assistant", content: m.content })),
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ message: text });
  } catch {
    return NextResponse.json({ message: "Bir sorun oluştu, lütfen tekrar deneyin." });
  }
}

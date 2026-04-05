import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp";

/* ------------------------------------------------------------------ */
/*  GET — Webhook Dogrulama (Meta verification handshake)              */
/* ------------------------------------------------------------------ */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
  ) {
    console.log("WhatsApp webhook dogrulandi");
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Dogrulama basarisiz" }, { status: 403 });
}

/* ------------------------------------------------------------------ */
/*  POST — Gelen Mesajlari Isle                                        */
/* ------------------------------------------------------------------ */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // WhatsApp Cloud API webhook yapisi
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.length) {
      // Status update veya bos mesaj — sadece 200 don
      return NextResponse.json({ status: "ok" });
    }

    const message = value.messages[0];
    const from = message.from; // Gonderen telefon numarasi
    const messageBody = message.text?.body?.toLowerCase() || "";

    console.log(`WhatsApp mesaji alindi — Kimden: ${from}, Mesaj: ${messageBody}`);

    // Otomatik yanit
    let reply: string;

    if (messageBody.includes("fiyat")) {
      reply =
        "Fiyat listemize buradan ulasabilirsiniz: " +
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://yaseminsatelier.com"}/urunler` +
        "\n\nDetayli bilgi icin bizi arayin veya mesaj atin.";
    } else if (messageBody.includes("rezervasyon")) {
      reply =
        "Online rezervasyon icin buraya tiklayabilirsiniz: " +
        `${process.env.NEXT_PUBLIC_BASE_URL || "https://yaseminsatelier.com"}/randevu` +
        "\n\nSize en uygun zamani birlikte belirleyelim.";
    } else {
      reply =
        "Mesajiniz alindi! En kisa surede size donecegiz. " +
        "Calisma saatlerimiz: Pzt-Cmt 09:00-18:00";
    }

    await sendWhatsAppMessage(from, reply);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("WhatsApp webhook hatasi:", error);
    // Webhook'larda her zaman 200 don, yoksa Meta tekrar dener
    return NextResponse.json({ status: "error" }, { status: 200 });
  }
}

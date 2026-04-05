import { NextResponse } from "next/server";
import { expireOldPoints } from "@/lib/loyalty";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 401 });
    }

    const result = await expireOldPoints();

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Expire points cron error:", error);
    return NextResponse.json(
      { error: "Puan suresi dolma islemi basarisiz" },
      { status: 500 }
    );
  }
}

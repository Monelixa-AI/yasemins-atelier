import { NextResponse } from "next/server";
import { sendWeeklyReport } from "@/lib/reports/scheduled";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendWeeklyReport();

    return NextResponse.json({
      ok: true,
      sent: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron weekly-report hatasi:", error);
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 });
  }
}

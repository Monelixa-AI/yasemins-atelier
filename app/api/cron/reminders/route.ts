import { NextResponse } from "next/server"
import { runBookingReminders } from "@/lib/automation"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await runBookingReminders()

    return NextResponse.json({
      ok: true,
      reminders: result,
    })
  } catch (error) {
    console.error("Cron reminders hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

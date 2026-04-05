import { NextResponse } from "next/server"
import { runBirthdayAutomation, runWinBackAutomation } from "@/lib/automation"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const birthdayResult = await runBirthdayAutomation()
    const winBackResult = await runWinBackAutomation()

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      birthday: birthdayResult,
      winBack: winBackResult,
    })
  } catch (error) {
    console.error("Cron daily hatasi:", error)
    return NextResponse.json({ error: "Bir hata olustu" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(new URL("/?error=invalid-token", request.url))
    }

    const setting = await prisma.setting.findUnique({
      where: { key: `newsletter_confirm_${token}` },
    })

    if (!setting) {
      return NextResponse.redirect(new URL("/?error=invalid-token", request.url))
    }

    const { email } = setting.value as { email: string }

    await prisma.newsletterSubscriber.updateMany({
      where: { email },
      data: { confirmedAt: new Date() },
    })

    await prisma.setting.delete({
      where: { key: `newsletter_confirm_${token}` },
    })

    return NextResponse.redirect(
      new URL("/tesekkurler?type=newsletter", request.url)
    )
  } catch (error) {
    console.error("Newsletter confirm hatasi:", error)
    return NextResponse.redirect(new URL("/?error=confirmation-failed", request.url))
  }
}

import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parametresi zorunludur" },
        { status: 400 }
      );
    }

    const prefs = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!prefs) {
      return NextResponse.json(
        { error: "Bildirim tercihleri bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Notification prefs GET error:", error);
    return NextResponse.json(
      { error: "Bildirim tercihleri alinamadi" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, ...data } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId zorunludur" },
        { status: 400 }
      );
    }

    const prefs = await prisma.notificationPreference.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Notification prefs PATCH error:", error);
    return NextResponse.json(
      { error: "Bildirim tercihleri guncellenemedi" },
      { status: 500 }
    );
  }
}

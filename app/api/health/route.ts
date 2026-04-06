import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const timestamp = new Date().toISOString();
  const version = process.env.VERCEL_GIT_COMMIT_SHA || "local";

  let databaseStatus: "ok" | "error" = "error";
  let dbError: string | undefined;

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseStatus = "ok";
  } catch (error) {
    dbError =
      error instanceof Error ? error.message : "Veritabani baglantisi basarisiz";
    console.error("[health] Veritabani hatasi:", error);
  }

  const isHealthy = databaseStatus === "ok";

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "unhealthy",
      database: databaseStatus,
      nextjs: "ok",
      timestamp,
      version,
      ...(dbError && { error: dbError }),
    },
    { status: isHealthy ? 200 : 503 }
  );
}

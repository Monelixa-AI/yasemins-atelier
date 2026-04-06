import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth, adminAuth } from "@/lib/auth";
import { rateLimits, checkRateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Rate Limiting (before auth) ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  // Password reset (more specific path — check before general auth)
  if (pathname === "/api/auth/forgot-password" || pathname === "/api/auth/reset-password") {
    const { success } = await checkRateLimit(rateLimits.passwordReset, ip);
    if (!success) {
      return NextResponse.json(
        { error: "Cok fazla istek gonderdiniz. Lutfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }
  }
  // Auth endpoints
  else if (pathname.startsWith("/api/auth")) {
    const { success } = await checkRateLimit(rateLimits.auth, ip);
    if (!success) {
      return NextResponse.json(
        { error: "Cok fazla giris denemesi. Lutfen 15 dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }
  }
  // Chat endpoint
  else if (pathname === "/api/chat") {
    const { success } = await checkRateLimit(rateLimits.chat, ip);
    if (!success) {
      return NextResponse.json(
        { error: "Sohbet limiti asildi. Lutfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }
  }
  // Payment endpoints
  else if (pathname.startsWith("/api/payments")) {
    const { success } = await checkRateLimit(rateLimits.payment, ip);
    if (!success) {
      return NextResponse.json(
        { error: "Cok fazla odeme istegi. Lutfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }
  }

  // --- Existing Auth Logic ---

  // Admin routes: require admin session
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = await adminAuth();
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // User account routes: require user session
  if (pathname.startsWith("/hesabim")) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL("/giris", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/hesabim/:path*",
    "/api/auth/:path*",
    "/api/chat",
    "/api/payments/:path*",
  ],
};

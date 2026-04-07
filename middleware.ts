import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { rateLimits, checkRateLimit } from "@/lib/rate-limit";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Rate Limiting ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous";

  if (pathname === "/api/auth/forgot-password" || pathname === "/api/auth/reset-password") {
    const { success } = await checkRateLimit(rateLimits.passwordReset, ip);
    if (!success) {
      return NextResponse.json(
        { error: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." },
        { status: 429 }
      );
    }
  } else if (pathname.startsWith("/api/auth") && !pathname.startsWith("/api/admin/auth")) {
    const { success } = await checkRateLimit(rateLimits.auth, ip);
    if (!success) {
      return NextResponse.json(
        { error: "Çok fazla giriş denemesi. 15 dakika sonra tekrar deneyin." },
        { status: 429 }
      );
    }
  } else if (pathname === "/api/chat") {
    const { success } = await checkRateLimit(rateLimits.chat, ip);
    if (!success) {
      return NextResponse.json(
        { error: "Sohbet limiti aşıldı." },
        { status: 429 }
      );
    }
  } else if (pathname.startsWith("/api/payments")) {
    const { success } = await checkRateLimit(rateLimits.payment, ip);
    if (!success) {
      return NextResponse.json(
        { error: "Çok fazla ödeme isteği." },
        { status: 429 }
      );
    }
  }

  // --- Admin Auth (JWT cookie) ---
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch {
      // Token invalid or expired
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin-token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    "/api/chat",
    "/api/payments/:path*",
  ],
};

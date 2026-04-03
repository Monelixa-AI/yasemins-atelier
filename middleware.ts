import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth, adminAuth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ["/admin/:path*", "/hesabim/:path*"],
};

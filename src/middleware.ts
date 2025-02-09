import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the token and verify it
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Debug logs
  console.log("Middleware Token:", token);
  console.log("Request URL:", request.url);

  // Check if this is an admin or account route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAccountRoute = request.nextUrl.pathname.startsWith("/account");

  // If no token and trying to access protected routes
  if (!token) {
    if (isAdminRoute || isAccountRoute) {
      // Store the current URL to redirect back after login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(loginUrl);
    }
  }

  // Additional admin-specific check
  if (isAdminRoute && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Add both admin and account routes to matcher
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/account/:path*",
    "/api/account/:path*",
  ],
};

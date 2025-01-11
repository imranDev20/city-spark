import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Get the token and verify it
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("Middleware Token:", token); // Debug log
  console.log("Request URL:", request.url); // Debug log
  console.log("Is Admin Route:", request.nextUrl.pathname.startsWith("/admin"));

  // Check if this is an admin route
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    // No token means not authenticated
    if (!token || !token.role) {
      // Store the current URL to redirect back after login
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", encodeURIComponent(request.url));
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is not an admin
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Add api routes to matcher to protect admin API routes as well
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

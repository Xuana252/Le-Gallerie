import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    const isDashboard = pathname.startsWith("/admin");

    if (isDashboard) {
      const roles = token?.role;

      // Check if it's an array and contains 'admin'
      const isAdmin = Array.isArray(roles) && roles.includes("admin");

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Just check if authenticated (we handle role in middleware above)
    },
  }
);

export const config = {
  matcher: [
    "/profile",
    "/create",
    "/edit",
    "/profile/setting/:path*",
    "/admin/:path*", // Admin-only route
  ],
};

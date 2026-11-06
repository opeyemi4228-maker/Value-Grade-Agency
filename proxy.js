import { NextResponse } from "next/server";

// Fast path only: send visitors without a session cookie straight to the right login page.
// Sessions are fully verified server-side on every page, action and API route
// (lib/admin/auth.js for /admin, lib/auth/session.js for /dashboard), so this is never the only check.
export function proxy(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (request.cookies.has("vga_session")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = pathname === "/dashboard" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (!request.cookies.has("vga_admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};

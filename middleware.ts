import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "auth-token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    return token 
      ? NextResponse.redirect(new URL("/tickets", request.url)) 
      : NextResponse.next();
  }

  const protectedPaths = ["/tickets", "/dashboard"];
  const isProtected = pathname === "/" || protectedPaths.some(p => pathname.startsWith(p));

  if (isProtected) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/") loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/tickets", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/tickets/:path*", "/dashboard/:path*"],
};

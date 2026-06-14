import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "auth-token";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  // 1. Nếu đã đăng nhập mà cố vào trang login, đẩy về tickets
  if (pathname === "/login") {
    return token 
      ? NextResponse.redirect(new URL("/tickets", request.url)) 
      : NextResponse.next();
  }

  // 2. Định nghĩa các đường dẫn công khai (Public)
  // Ngoài /login ra, chúng ta cần cho phép các file tĩnh (next, favicon, v.v.)
  const isPublicPath = pathname === "/login" || pathname.startsWith("/_next") || pathname.includes(".");

  // 3. Bảo vệ tất cả các trang còn lại
  if (!isPublicPath && !token) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
    
  // 4. Mặc định chuyển / về /tickets nếu đã qua được bước kiểm tra token
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/tickets", request.url));
  }

  return NextResponse.next();
}

export const config = {
  /* 
    Matcher này sử dụng Negative Lookahead để bảo vệ TẤT CẢ các trang.
    Nó bao gồm cả '/tickets', '/tickets/:path*', '/dashboard', v.v.
    Chỉ loại trừ các tài nguyên hệ thống và API.
  */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

import { NextResponse } from "next/server";

const AUTH_COOKIE = "auth-token";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}

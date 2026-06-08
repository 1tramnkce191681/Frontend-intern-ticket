import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";

const AUTH_TOKEN = "mock-token-12345";
const AUTH_COOKIE = "auth-token";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message || "Invalid credentials" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE, AUTH_TOKEN, {
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

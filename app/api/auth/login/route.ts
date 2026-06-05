import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mock credentials
    if (email === "admin@example.com" && password === "password123") {
      return NextResponse.json(
        {
          token: "mock-jwt-token-" + Date.now(),
          user: {
            id: "1",
            email: "admin@example.com",
            name: "Admin User",
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { validateUserLogin } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation
    const validatedData = validateUserLogin(body);

    // Business logic
    const user = await AuthService.authenticateUser(validatedData.email, validatedData.password);

    return NextResponse.json(
      {
        message: "Login successful",
        user,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Signin error:", error);

    // Don't expose detailed errors in production
    const message =
      process.env.NODE_ENV === "production"
        ? "Authentication failed"
        : error instanceof Error
          ? error.message
          : "Internal server error";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

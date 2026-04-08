import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/services/auth.service";
import { validateUserCreate } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation
    const validatedData = validateUserCreate(body);

    // Business logic
    const user = await AuthService.registerUser(validatedData);

    return NextResponse.json(
      {
        message: "User created successfully",
        user,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error in signup:", error);

    // Don't expose detailed errors in production
    const message =
      process.env.NODE_ENV === "production"
        ? "Registration failed"
        : error?.message || "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: error?.message?.includes("already exists") ? 409 : 400 },
    );
  }
}

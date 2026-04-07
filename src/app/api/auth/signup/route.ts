import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseService } from "@/services/supabaseService";

const ACCESS_KEYS = {
  admin: "Admin12345",
  employee: "employee12345",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, number, country, image_url, role, accessKey } = body;

    const typedRole = role as "admin" | "employee" | "user";

    // Validate required fields
    if (!name || !email || !password || !number || !country || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate role and access key
    if (typedRole === "admin" || typedRole === "employee") {
      if (!accessKey || accessKey !== ACCESS_KEYS[typedRole]) {
        return NextResponse.json(
          { error: "Invalid access key for selected role" },
          { status: 403 },
        );
      }
    }

    // Check if user already exists
    const existingUser = await supabaseService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      number,
      country,
      image_url: image_url || null,
      role: typedRole,
    };

    const newUser = await supabaseService.createUser(userData);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

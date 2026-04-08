import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseService } from "@/services/supabaseService";

const ACCESS_KEYS = {
  admin: "Admin12345",
  employee: "employee12345",
};

export async function POST(request: NextRequest) {
  try {
    console.log("📝 Step 1: Parsing request body");
    const body = await request.json();
    const { name, email, password, number, country, countryCode, image_url, role, accessKey } =
      body;

    const typedRole = role as "admin" | "employee" | "user";
    console.log("📝 Step 2: Validating fields");

    // Validate required fields
    if (!name || !email || !password || !number || !country || !role) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("📝 Step 3: Checking role and access key");
    // Validate role and access key
    if (typedRole === "admin" || typedRole === "employee") {
      if (!accessKey || accessKey !== ACCESS_KEYS[typedRole]) {
        console.log("❌ Invalid access key");
        return NextResponse.json(
          { error: "Invalid access key for selected role" },
          { status: 403 },
        );
      }
    }

    console.log("📝 Step 4: Checking existing user");
    // Check if user already exists
    const existingUser = await supabaseService.getUserByEmail(email);
    if (existingUser) {
      console.log("❌ User already exists");
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    console.log("📝 Step 5: Hashing password");
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("📝 Step 6: Creating user data");
    // Create user
    const userData = {
      name,
      email,
      password: hashedPassword,
      number,
      country,
      countryCode,
      image_url: image_url || null,
      role: typedRole,
    };

    console.log("📝 Step 7: Calling supabaseService.createUser");
    const newUser = await supabaseService.createUser(userData);
    console.log("✅ Step 8: User created successfully");

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("💥 Error in signup:", error);
    return NextResponse.json({ error: "Internal server error", details: error?.message || String(error) }, { status: 500 });
  }
}

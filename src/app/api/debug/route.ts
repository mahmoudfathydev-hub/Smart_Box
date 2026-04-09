import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? "Set" : "Missing",
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "Not set (using localhost)",
  });
}

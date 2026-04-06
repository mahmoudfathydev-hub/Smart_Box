import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!category) {
      return NextResponse.json(
        { error: "Category parameter is required" },
        { status: 400 },
      );
    }

    // Return empty related products since mock data is removed
    return NextResponse.json({ products: [] });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 },
    );
  }
}

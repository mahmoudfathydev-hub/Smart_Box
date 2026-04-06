import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/lib/repositories/product.repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const excludeSlug = searchParams.get("excludeSlug");
    const limit = parseInt(searchParams.get("limit") || "8");

    if (!category) {
      return NextResponse.json({ error: "Category parameter is required" }, { status: 400 });
    }

    // Get related products using repository pattern
    const relatedProducts = await ProductRepository.getRelatedProducts(
      category,
      excludeSlug || "",
      limit,
    );

    return NextResponse.json({ products: relatedProducts });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch related products",
      },
      { status: 500 },
    );
  }
}

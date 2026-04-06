import { NextRequest, NextResponse } from "next/server";
import { ProductsService } from "@/lib/services/products.service";

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

    // Get related products from database
    const relatedProducts = await ProductsService.getRelatedProducts(
      category,
      limit,
    );

    return NextResponse.json({ products: relatedProducts });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch related products",
      },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ProductsService } from "@/lib/services/products.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Get product from database
    const product = await ProductsService.getProductBySlug(slug);

    return NextResponse.json({ product });
  } catch (error) {
    console.error("API Error:", error);

    // If product not found, return 404
    if (
      error instanceof Error &&
      error.message.includes("Failed to fetch product")
    ) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch product",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { ProductRepository } from "@/lib/repositories/product.repository";

export async function GET() {
  try {
    // Get all products to debug
    const result = await ProductRepository.getAllProducts({ limit: 20 });

    // Create a mapping of available products
    const productMappings = result.products.map((product) => {
      // Generate slug from name_en (same as adapter)
      const slugFromName =
        (product.name_en || "")
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim() || `product-${product.id}`;

      return {
        id: product.id,
        name_en: product.name_en || "",
        name_ar: product.name_ar || "",
        slug: slugFromName,
        price: product.price,
        // Generate possible URLs
        urls: [
          `/en/products/${slugFromName}`,
          `/ar/products/${slugFromName}`,
          `/en/products/${product.id}`,
          `/ar/products/${product.id}`,
        ],
        // Also show the exact name_en for direct access
        directAccess: `/en/products/${encodeURIComponent(product.name_en || "")}`,
      };
    });

    return NextResponse.json({
      success: true,
      products: productMappings,
      total: result.pagination.totalItems,
      message: "Debug: All products in database - using name_en as slug",
      explanation: "The system uses name_en field as the slug (URL parameter)",
      suggestions: {
        tryTheseUrls: productMappings.slice(0, 5).flatMap((p) => p.urls),
        tryDirectNames: productMappings.slice(0, 3).map((p) => p.directAccess),
        note: "Try URLs above or use exact product names from the database",
      },
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Debug failed",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}

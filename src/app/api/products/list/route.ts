import { NextResponse } from "next/server";
import { ProductsService } from "@/lib/services/products.service";

export async function GET() {
  try {
    const result = await ProductsService.getPublicProducts();
    return NextResponse.json(result.products);
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { ProductRepository } from "@/lib/repositories/product.repository";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Try to get specific product
    const product = await ProductRepository.getProductBySlug(slug);
    
    return NextResponse.json({
      slug,
      product,
      found: !!product,
      message: `Debug: Product lookup for "${slug}"`
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Debug failed" },
      { status: 500 }
    );
  }
}

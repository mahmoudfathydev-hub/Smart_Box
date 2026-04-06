import { NextResponse } from "next/server";
import { ProductRepository } from "@/lib/repositories/product.repository";

export async function GET() {
  try {
    // Test basic repository functionality
    console.log("[TEST] Testing ProductRepository...");
    
    // Test 1: Get all products
    const allProducts = await ProductRepository.getAllProducts({ limit: 5 });
    console.log(`[TEST] Found ${allProducts.products.length} products`);
    
    // Test 2: Try to get a specific product if any exist
    let testProduct = null;
    if (allProducts.products.length > 0) {
      const firstProduct = allProducts.products[0];
      testProduct = await ProductRepository.getProductBySlug(firstProduct.slug);
      console.log(`[TEST] Retrieved product: ${testProduct?.name || 'null'}`);
    }
    
    return NextResponse.json({
      success: true,
      message: "ProductRepository test completed",
      results: {
        totalProducts: allProducts.pagination.totalItems,
        sampleProducts: allProducts.products.map(p => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price
        })),
        testProduct: testProduct ? {
          id: testProduct.id,
          slug: testProduct.slug,
          name: testProduct.name,
          price: testProduct.price
        } : null
      }
    });
  } catch (error) {
    console.error("[TEST] Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 });
  }
}

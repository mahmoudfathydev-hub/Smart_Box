import { NextRequest, NextResponse } from "next/server";
import { ProductsService } from "@/lib/services/products.service";
import { validateProductCreate } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = validateProductCreate(body);
    
    const product = await ProductsService.createProduct(validatedData);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 400 }
    );
  }
}

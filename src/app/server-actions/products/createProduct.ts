"use server";

import { revalidatePath } from "next/cache";
import { ProductsService } from "@/lib/services/products.service";
import { validateProductCreate } from "@/lib/validation/schemas";
import { Product } from "@/types/product";

export async function createProduct(productData: Partial<Product>) {
  try {
    // Server-side validation
    const validatedData = validateProductCreate(productData);

    // Business logic
    const product = await ProductsService.createProduct(validatedData);

    // Revalidate relevant pages
    revalidatePath("/products");
    revalidatePath("/dashboard");

    return { success: true, product };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ProductsService } from "@/lib/services/products.service";
import { errorLogger } from "@/lib/utils/errorLogger";
import {
  validateQuery,
  productsQuerySchema,
  sanitizeSearchQuery,
  sanitizeString,
} from "@/lib/validation/schemas";

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log("=== API PRODUCTS ROUTE DEBUG ===");
    const { searchParams } = new URL(request.url);
    console.log("Request URL:", request.url);
    console.log("Query params:", Object.fromEntries(searchParams.entries()));

    // Convert URLSearchParams to object for validation
    const queryObject: Record<string, any> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === "tags" && value) {
        // Handle tags array
        queryObject[key] = value
          .split(",")
          .map((tag) => sanitizeString(tag))
          .filter(Boolean);
      } else if (key === "search") {
        // Sanitize search query
        queryObject[key] = sanitizeSearchQuery(value);
      } else if (key === "category" || key === "brand") {
        // Sanitize string fields
        queryObject[key] = sanitizeString(value);
      } else if (value) {
        queryObject[key] = value;
      }
    }

    // Validate and sanitize all query parameters
    const validatedParams = validateQuery(productsQuerySchema, queryObject);
    console.log("Validated and sanitized parameters:", validatedParams);

    // Fetch products from database
    console.log("Calling ProductsService.getProducts...");
    const result = await ProductsService.getProducts(validatedParams);

    console.log("ProductsService.getProducts result:", {
      productsCount: result.products?.length || 0,
      pagination: result.pagination,
      firstProduct: result.products?.[0] || null,
    });

    const response = NextResponse.json(result);
    const duration = Date.now() - startTime;

    console.log("API response status:", response.status);
    console.log("Request duration:", duration, "ms");
    console.log("=== END API PRODUCTS ROUTE DEBUG ===");

    // Log successful request
    await errorLogger.info(`Products fetched successfully`, {
      component: "API",
      action: "GET /api/products",
      duration,
      productsCount: result.products?.length || 0,
      pagination: result.pagination,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error("=== API PRODUCTS ROUTE ERROR ===");
    console.error("Error details:", error);
    console.error("Error type:", typeof error);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : "Unknown error",
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    // Log the error
    await errorLogger.logApiError(error, "/api/products", "GET", {
      duration,
      url: request.url,
    });

    // Return appropriate error response
    let statusCode = 500;
    let errorMessage = "Failed to fetch products";

    if (error instanceof Error) {
      if (error.message.includes("Validation failed")) {
        statusCode = 400;
        errorMessage = error.message;
      } else if (error.message.includes("Database")) {
        statusCode = 503;
        errorMessage = "Database service unavailable";
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : undefined
            : undefined,
      },
      { status: statusCode },
    );
  }
}

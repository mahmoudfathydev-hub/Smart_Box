import { NextRequest, NextResponse } from "next/server";
import { AccessoriesService } from "@/lib/services/accessories.service";
import { AccessoryQueryParams } from "@/types/accessory";
import { validateAccessoryCreate, validateAccessoryQuery } from "@/lib/validation/schemas";

// File: c:\Users\hp\Desktop\projects\smartbox\src\app\api\accessories\route.ts

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using Zod schema
    const validatedData = validateAccessoryCreate(body);

    // Create accessory through Service layer
    const accessory = await AccessoriesService.createAccessory(validatedData);

    return NextResponse.json(
      {
        message: "Accessory created successfully",
        accessory,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);

    // Return appropriate error response
    let statusCode = 500;
    let errorMessage = "Failed to create accessory";

    if (error instanceof Error) {
      if (error.message.includes("Validation failed")) {
        statusCode = 400;
        errorMessage = error.message;
      } else if (error.message.includes("Invalid accessory")) {
        statusCode = 400;
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: statusCode },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Convert URLSearchParams to object for validation
    const queryObject: Record<string, any> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key === "compatibleDevices" && value) {
        // Handle array parameter
        queryObject[key] = value.split(",").map((item: string) => item.trim());
      } else if (value) {
        queryObject[key] = value;
      }
    }

    // Validate query parameters using Zod schema
    const validatedParams = validateAccessoryQuery(queryObject);

    // Fetch accessories through Service layer
    const result = await AccessoriesService.getAccessories(validatedParams);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);

    // Return appropriate error response
    let statusCode = 500;
    let errorMessage = "Failed to fetch accessories";

    if (error instanceof Error) {
      if (error.message.includes("Validation failed")) {
        statusCode = 400;
        errorMessage = error.message;
      } else if (error.message.includes("Invalid accessory")) {
        statusCode = 400;
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: statusCode },
    );
  }
}

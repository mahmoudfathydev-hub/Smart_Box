import { z } from "zod";

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

export const priceRangeSchema = z
  .object({
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
  })
  .refine(
    (data) => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: "Minimum price must be less than or equal to maximum price",
    },
  );

export const ratingSchema = z.object({
  rating: z.coerce.number().min(0).max(5).optional(),
});

export const sortingSchema = z.object({
  sortBy: z
    .enum(["name", "price", "rating", "created_at", "popularity"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const searchSchema = z.object({
  search: z.string().trim().max(100).optional(),
});

export const categorySchema = z.object({
  category: z.string().trim().max(50).optional(),
});

export const brandSchema = z.object({
  brand: z.string().trim().max(50).optional(),
});

export const availabilitySchema = z.object({
  availability: z.enum(["in_stock", "out_of_stock", "all"]).optional(),
});

export const tagsSchema = z.object({
  tags: z.array(z.string().trim().max(30)).optional(),
});

// Combined products query schema
export const productsQuerySchema = z.intersection(
  z.intersection(
    z.intersection(
      z.intersection(
        z.intersection(
          z.intersection(
            z.intersection(paginationSchema, searchSchema),
            categorySchema,
          ),
          brandSchema,
        ),
        priceRangeSchema,
      ),
      ratingSchema,
    ),
    availabilitySchema,
  ),
  z.intersection(sortingSchema, tagsSchema),
);

// Product creation/update schema
export const productCreateSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().trim().min(1).max(2000),
  shortDescription: z.string().trim().max(500).optional(),
  brand: z.string().trim().min(1).max(100),
  categoryId: z.string().trim().min(1),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional(),
  currency: z.string().length(3).default("USD"),
  rating: z.number().min(0).max(5).default(0),
  stockQuantity: z.number().int().min(0),
  images: z.array(z.string().url()).default([]),
  specs: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(100),
        value: z.string().trim().min(1).max(200),
      }),
    )
    .default([]),
  isActive: z.boolean().default(true),
  tags: z.array(z.string().trim().max(30)).default([]),
  sku: z.string().trim().max(50).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z
    .object({
      length: z.number().min(0),
      width: z.number().min(0),
      height: z.number().min(0),
    })
    .optional(),
});

// Product update schema (all fields optional)
export const productUpdateSchema = productCreateSchema.partial();

// User input sanitization helpers
export const sanitizeString = (input: unknown): string | undefined => {
  if (typeof input !== "string") return undefined;
  return input.trim().replace(/[<>]/g, ""); // Remove potential HTML tags
};

export const sanitizeSearchQuery = (input: unknown): string | undefined => {
  const sanitized = sanitizeString(input);
  if (!sanitized) return undefined;

  // Remove potentially dangerous characters
  return sanitized.replace(/['"\\]/g, "").substring(0, 100);
};

export const sanitizeSlug = (input: unknown): string | undefined => {
  const sanitized = sanitizeString(input);
  if (!sanitized) return undefined;

  // Convert to lowercase and replace spaces with hyphens
  return sanitized
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .trim()
    .substring(0, 200);
};

// Validation middleware helper
export const validateQuery = <T>(schema: z.ZodSchema<T>, query: unknown) => {
  try {
    return schema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      }));
      throw new Error(
        `Validation failed: ${formattedErrors.map((e: any) => `${e.field}: ${e.message}`).join(", ")}`,
      );
    }
    throw error;
  }
};

// Environment variable validation
export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  DATABASE_URL: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_ENABLE_ERROR_LOGGING: z.enum(["true", "false"]).optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

export const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Environment validation failed:", error.issues);
      throw new Error("Invalid environment variables");
    }
    throw error;
  }
};

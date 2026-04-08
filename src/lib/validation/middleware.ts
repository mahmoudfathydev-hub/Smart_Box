import { NextRequest } from "next/server";
import { ZodSchema, ZodError } from "zod";

export function validateRequest(schema: ZodSchema) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json();
      return schema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new Error(`Validation failed: ${JSON.stringify(formattedErrors)}`);
      }
      throw error;
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (query: unknown) => {
    try {
      return schema.parse(query);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new Error(`Query validation failed: ${JSON.stringify(formattedErrors)}`);
      }
      throw error;
    }
  };
}

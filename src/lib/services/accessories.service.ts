import { AccessoriesRepository } from "@/lib/repositories/accessories.repository";
import { accessoryAdapter } from "@/lib/adapters/accessory.adapter";
import { AccessoryQueryParams, AccessoriesResponse } from "@/types/accessory";
import { Product } from "@/types/product";
import { z } from "zod";
import { accessoryCreateSchema, accessoryUpdateSchema } from "@/lib/validation/schemas";

// DTO types for type safety
export interface CreateAccessoryDTO {
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  type: string;
  brand: string;
  price: number;
  stock_quantity?: number;
  image_url?: string;
  compatible_devices?: string[];
  status?: "active" | "inactive";
  discount?: number;
  sku?: string;
  currency?: string;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface UpdateAccessoryDTO {
  name_en?: string;
  name_ar?: string;
  description_en?: string;
  description_ar?: string;
  type?: string;
  brand?: string;
  price?: number;
  stock_quantity?: number;
  image_url?: string;
  compatible_devices?: string[];
  status?: "active" | "inactive";
  discount?: number;
  sku?: string;
  currency?: string;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

// Type inference from Zod schemas
export type CreateAccessoryInput = z.infer<typeof accessoryCreateSchema>;
export type UpdateAccessoryInput = z.infer<typeof accessoryUpdateSchema>;

/**
 * Accessories Service Layer
 * Business logic for accessories operations
 * Follows Clean Architecture principles
 */
export class AccessoriesService {
  /**
   * Get all accessories with filtering and pagination
   */
  static async getAccessories(params: AccessoryQueryParams = {}): Promise<AccessoriesResponse> {
    // Business logic: Apply default filters for public access
    const filteredParams = {
      ...params,
      status: params.status || "active",
    };

    return AccessoriesRepository.getAllAccessories(filteredParams);
  }

  /**
   * Get single accessory by slug
   */
  static async getAccessoryBySlug(slug: string): Promise<Product | null> {
    const accessory = await AccessoriesRepository.getAccessoryBySlug(slug);

    if (!accessory) {
      return null;
    }

    // Business logic: Ensure accessory is active for public view
    if (accessory.status !== "active") {
      return null;
    }

    return accessory;
  }

  /**
   * Get accessory by ID (internal use)
   */
  static async getAccessoryById(id: string): Promise<Product | null> {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error("Invalid accessory ID");
    }

    // Convert slug-based ID lookup to repository call
    const accessory = await AccessoriesRepository.getAccessoryBySlug(numericId.toString());
    return accessory;
  }

  /**
   * Get featured accessories
   */
  static async getFeaturedAccessories(limit: number = 8): Promise<Product[]> {
    return AccessoriesRepository.getFeaturedAccessories(limit);
  }

  /**
   * Get accessories by type
   */
  static async getAccessoriesByType(type: string, limit: number = 12): Promise<Product[]> {
    // Business logic: Validate type
    const validTypes = ["phone", "laptop", "tablet", "watch", "headphones", "other"];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid accessory type: ${type}`);
    }

    return AccessoriesRepository.getAccessoriesByType(type, limit);
  }

  /**
   * Get related accessories
   */
  static async getRelatedAccessories(
    type: string,
    excludeSlug: string,
    limit: number = 8,
  ): Promise<Product[]> {
    return AccessoriesRepository.getRelatedAccessories(type, excludeSlug, limit);
  }

  /**
   * Search accessories
   */
  static async searchAccessories(query: string, limit: number = 12): Promise<Product[]> {
    // Business logic: Validate search query
    if (!query || query.trim().length < 2) {
      throw new Error("Search query must be at least 2 characters");
    }

    return AccessoriesRepository.searchAccessories(query.trim(), limit);
  }

  /**
   * Get accessories on sale
   */
  static async getAccessoriesOnSale(limit: number = 12): Promise<Product[]> {
    return AccessoriesRepository.getAccessoriesOnSale(limit);
  }

  /**
   * Get accessories by brand
   */
  static async getAccessoriesByBrand(brand: string, limit: number = 12): Promise<Product[]> {
    // Business logic: Validate brand
    if (!brand || brand.trim().length < 2) {
      throw new Error("Brand name must be at least 2 characters");
    }

    return AccessoriesRepository.getAccessoriesByBrand(brand.trim(), limit);
  }

  /**
   * Create new accessory with business validation
   */
  static async createAccessory(data: CreateAccessoryDTO): Promise<Product> {
    // Business validation using Zod schema
    const validatedData = accessoryCreateSchema.parse(data);

    // Business logic: Generate SKU if not provided
    if (!validatedData.sku) {
      validatedData.sku = this.generateSKU(validatedData.name_en, validatedData.brand);
    }

    // Business logic: Set default currency
    if (!validatedData.currency) {
      validatedData.currency = "USD";
    }

    // Business logic: Validate price
    if (validatedData.price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    // Business logic: Validate stock
    if (validatedData.stock_quantity !== undefined && validatedData.stock_quantity < 0) {
      throw new Error("Stock quantity cannot be negative");
    }

    // Business logic: Validate discount
    if (validatedData.discount !== undefined && validatedData.discount < 0) {
      throw new Error("Discount cannot be negative");
    }

    // Convert to repository format
    const repositoryData = accessoryAdapter.mapAccessoryToRow(validatedData);

    return AccessoriesRepository.createAccessory(repositoryData);
  }

  /**
   * Update accessory with business validation
   */
  static async updateAccessory(id: string, data: UpdateAccessoryDTO): Promise<Product> {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error("Invalid accessory ID");
    }

    // Business validation using Zod schema
    const validatedData = accessoryUpdateSchema.parse(data);

    // Business logic: Validate price if provided
    if (validatedData.price !== undefined && validatedData.price <= 0) {
      throw new Error("Price must be greater than 0");
    }

    // Business logic: Validate stock if provided
    if (validatedData.stock_quantity !== undefined && validatedData.stock_quantity < 0) {
      throw new Error("Stock quantity cannot be negative");
    }

    // Business logic: Validate discount if provided
    if (validatedData.discount !== undefined && validatedData.discount < 0) {
      throw new Error("Discount cannot be negative");
    }

    // Convert to repository format
    const repositoryData = accessoryAdapter.mapAccessoryToRow(validatedData);

    return AccessoriesRepository.updateAccessory(numericId, repositoryData);
  }

  /**
   * Delete accessory with business validation
   */
  static async deleteAccessory(id: string): Promise<void> {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      throw new Error("Invalid accessory ID");
    }

    // Business logic: Check if accessory exists before deletion
    const accessory = await this.getAccessoryById(id);
    if (!accessory) {
      throw new Error("Accessory not found");
    }

    return AccessoriesRepository.deleteAccessory(numericId);
  }

  /**
   * Business logic: Generate SKU from name and brand
   */
  private static generateSKU(name: string, brand: string): string {
    const namePrefix = name
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 3)
      .toUpperCase();
    const brandPrefix = brand
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 3)
      .toUpperCase();
    const timestamp = Date.now().toString().slice(-4);

    return `${brandPrefix}-${namePrefix}-${timestamp}`;
  }

  /**
   * Business logic: Calculate discount price
   */
  static calculateDiscountPrice(accessory: Product): number {
    if (accessory.discountPrice) {
      return accessory.discountPrice;
    }
    return accessory.price;
  }

  /**
   * Business logic: Check if accessory is in stock
   */
  static isInStock(accessory: Product): boolean {
    return (accessory.stockQuantity ?? 0) > 0;
  }

  /**
   * Business logic: Get accessory availability status
   */
  static getAvailabilityStatus(accessory: Product): "in_stock" | "out_of_stock" | "limited" {
    const stock = accessory.stockQuantity ?? 0;
    if (stock === 0) {
      return "out_of_stock";
    }
    if (stock < 5) {
      return "limited";
    }
    return "in_stock";
  }
}

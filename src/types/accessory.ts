/**
 * Unified Accessory Type
 * Compatible with accessories table structure
 */

export interface AccessoryImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface Accessory {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  image_url?: string;
  slug: string;
  type?: string;
  brand?: string;
  brand_en?: string;
  brand_ar?: string;
  sku?: string;
  status?: string;
  is_active?: boolean;
  discount?: number;
  discountPrice?: number;
  stock_quantity?: number;
  compatible_devices?: string[];
  createdAt?: string;
  updatedAt?: string;
  currency?: string;
  rating?: number;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  specs?: Array<{
    name: string;
    value: string;
  }>;
}

/**
 * Supabase accessories table row type
 * Based on actual database structure
 */
export interface AccessoryRow {
  id: number;
  created_at: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  type?: string;
  brand?: string;
  sku?: string;
  status?: string;
  discount?: number;
  stock_quantity?: number;
  compatible_devices?: string[];
  image_url?: string;
  updated_at?: string;
  currency?: string;
  // Note: rating is not stored in database, it's calculated from reviews
  tags?: string[];
  weight?: number;
  dimensions?: any;
}

/**
 * Accessory query parameters
 */
export interface AccessoryQueryParams {
  page?: number;
  limit?: number;
  type?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  compatibleDevices?: string[];
  sortBy?: "name" | "price" | "rating" | "created_at" | "type" | "brand" | "popularity";
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated accessories response
 */
export interface AccessoriesResponse {
  accessories: Accessory[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

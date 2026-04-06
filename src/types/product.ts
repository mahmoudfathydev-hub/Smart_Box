/**
 * Unified Product Type
 * Compatible with Add_Products table structure
 */

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  name_en?: string;
  name_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  images: ProductImage[];
  slug: string;
  category?: string;
  category_en?: string;
  category_ar?: string;
  createdAt?: string;
  updatedAt?: string;
  stockQuantity?: number;
  discountPrice?: number;
  currency?: string;
  rating?: number;
  brand?: string;
  brand_en?: string;
  brand_ar?: string;
  sku?: string;
  isActive?: boolean;
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
 * Supabase Add_Products table row type
 * Based on actual database structure
 */
export interface ProductRow {
  id: number;
  created_at: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  category_ar?: string;
  category_en?: string;
  brand_ar?: string;
  brand_en?: string;
  price: number;
  discount?: number;
  stock?: number;
  sku?: string;
  images_url?: string;
  specs_en?: Record<string, string>;
  specs_ar?: Record<string, string>;
  is_active?: boolean;
  slug?: string;
  updated_at?: string;
  weight?: number;
  dimensions?: any;
  currency?: string;
  rating?: number;
  tags?: string[];
}

/**
 * Product query parameters
 */
export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: "in_stock" | "out_of_stock" | "all";
  tags?: string[];
  sortBy?: "name" | "price" | "rating" | "created_at";
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated products response
 */
export interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

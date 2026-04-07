import { supabase } from "@/lib/supabase";
import { Product, ProductRow, ProductQueryParams, ProductsResponse } from "@/types/product";
import { productAdapter } from "@/lib/adapters/product.adapter";

/**
 * Product Repository
 * Single source of truth for all product data operations
 */
export class ProductRepository {
  private static readonly TABLE_NAME = "Add_Products";

  /**
   * Get all products with filtering and pagination
   */
  static async getAllProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      rating,
      availability,
      tags,
      sortBy = "created_at",
      sortOrder = "desc",
    } = params;

    let query = supabase.from(this.TABLE_NAME).select("*", { count: "exact" });

    // Apply filters
    if (search) {
      query = query.or(
        `name_en.ilike.%${search}%,name_ar.ilike.%${search}%,description_en.ilike.%${search}%,description_ar.ilike.%${search}%`,
      );
    }

    if (category) {
      query = query.or(`category_en.eq.${category},category_ar.eq.${category}`);
    }

    if (brand) {
      query = query.or(`brand_en.ilike.%${brand}%,brand_ar.ilike.%${brand}%`);
    }

    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    // Note: rating filter removed as column doesn't exist in database

    if (availability && availability !== "all") {
      if (availability === "in_stock") {
        query = query.gt("stock", 0);
      } else {
        query = query.eq("stock", 0);
      }
    }

    if (tags && tags.length > 0) {
      query = query.contains("tags", tags);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    const products = (data || []).map(productAdapter.mapProductRow);

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil((count || 0) / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get single product by slug (using name_en as slug)
   */
  static async getProductBySlug(slug: string): Promise<Product | null> {
    let data, error;

    // Try to find by name_en (treating name_en as slug)
    const result = await supabase.from(this.TABLE_NAME).select("*").eq("name_en", slug).single();

    data = result.data;
    error = result.error;

    // If not found by exact name match, try ID fallback
    if (!data && error?.code === "PGRST116") {
      const numericId = parseInt(slug);
      if (!isNaN(numericId)) {
        const idResult = await supabase
          .from(this.TABLE_NAME)
          .select("*")
          .eq("id", numericId)
          .single();

        data = idResult.data;
        error = idResult.error;
      }
    }

    // If still not found, try partial name match
    if (!data && error?.code === "PGRST116") {
      const nameResult = await supabase
        .from(this.TABLE_NAME)
        .select("*")
        .ilike("name_en", `%${slug}%`)
        .limit(1)
        .single();

      data = nameResult.data;
      error = nameResult.error;
    }

    if (error) {
      if (error.code === "PGRST116") {
        return null; // Product not found
      }
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return productAdapter.mapProductRow(data);
  }

  /**
   * Get featured products (newest products)
   */
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch featured products: ${error.message}`);
    }

    return (data || []).map(productAdapter.mapProductRow);
  }

  /**
   * Get products by category
   */
  static async getProductsByCategory(category: string, limit: number = 12): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .or(`category_en.eq.${category},category_ar.eq.${category}`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }

    return (data || []).map(productAdapter.mapProductRow);
  }

  /**
   * Get related products by category
   */
  static async getRelatedProducts(
    category: string,
    excludeSlug: string,
    limit: number = 8,
  ): Promise<Product[]> {
    // First, get the product ID from the slug since slug column doesn't exist in DB
    const { data: productData, error: productError } = await supabase
      .from(this.TABLE_NAME)
      .select("id, name_en")
      .eq("is_active", true)
      .limit(1000);

    if (productError) {
      throw new Error(`Failed to fetch products for slug lookup: ${productError.message}`);
    }

    // Find the product ID that matches the excludeSlug
    const excludeProduct = productData?.find((product) => {
      const generatedSlug =
        product.name_en
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim() || `product-${product.id}`;
      return generatedSlug === excludeSlug;
    });

    const excludeProductId = excludeProduct?.id;

    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .or(`category_en.eq.${category},category_ar.eq.${category}`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit + (excludeProductId ? 1 : 0)); // Get extra to account for exclusion

    if (error) {
      throw new Error(`Failed to fetch related products: ${error.message}`);
    }

    // Filter out the excluded product by ID
    const filteredData = (data || []).filter((product) => product.id !== excludeProductId);

    return filteredData.slice(0, limit).map(productAdapter.mapProductRow);
  }

  /**
   * Search products
   */
  static async searchProducts(query: string, limit: number = 12): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .or(
        `name_en.ilike.%${query}%,name_ar.ilike.%${query}%,description_en.ilike.%${query}%,description_ar.ilike.%${query}%`,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }

    return (data || []).map(productAdapter.mapProductRow);
  }

  /**
   * Get products on sale
   */
  static async getProductsOnSale(limit: number = 12): Promise<Product[]> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .select("*")
      .gt("discount", 0)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch sale products: ${error.message}`);
    }

    return (data || []).map(productAdapter.mapProductRow);
  }

  /**
   * Create new product
   */
  static async createProduct(product: Partial<ProductRow>): Promise<Product> {
    const { data, error } = await supabase.from(this.TABLE_NAME).insert(product).select().single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return productAdapter.mapProductRow(data);
  }

  /**
   * Update product
   */
  static async updateProduct(id: number, updates: Partial<ProductRow>): Promise<Product> {
    const { data, error } = await supabase
      .from(this.TABLE_NAME)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return productAdapter.mapProductRow(data);
  }

  /**
   * Delete product
   */
  static async deleteProduct(id: number): Promise<void> {
    const { error } = await supabase.from(this.TABLE_NAME).delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }
}

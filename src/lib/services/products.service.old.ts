import { ProductRepository } from "@/lib/repositories/product.repository";
import { ReviewsRepository } from "@/lib/repositories/reviews.repository";
import { Product, ProductQueryParams, ProductsResponse } from "@/types/product";

export class ProductsService {
  // Business logic: Get product with all related data
  static async getProductDetails(slug: string): Promise<Product | null> {
    const [product, reviews] = await Promise.all([
      ProductRepository.getBySlug(slug),
      ReviewsRepository.getProductAverageRating(slug),
    ]);

    if (!product) return null;

    return {
      ...product,
      rating: reviews.average,
    };
  }

  // Business logic: Get publicly visible products only
  static async getPublicProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
    // Business rule: Only active and in-stock products for public view
    const filteredParams = {
      ...params,
      isActive: true,
      stock_gt: 0,
    };

    return ProductRepository.getAllProducts(filteredParams);
  }

  // Business logic: Create product with validation and defaults
  static async createProduct(productData: Partial<Product>): Promise<Product> {
    // Business rule: Generate slug if not provided
    if (!productData.slug) {
      productData.slug = this.generateSlug(productData.name || "");
    }

    // Business rule: Set default currency
    if (!productData.currency) {
      productData.currency = "USD";
    }

    // Business rule: Ensure required fields
    if (!productData.name || !productData.price) {
      throw new Error("Product name and price are required");
    }

    return ProductRepository.create(productData);
  }

  // Business logic: Update product
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return ProductRepository.update(parseInt(id), updates);
  }

  // Business logic: Delete product
  static async deleteProduct(id: string): Promise<void> {
    return ProductRepository.delete(parseInt(id));
  }

  // Business logic: Get products by category
  static async getProductsByCategory(category: string, limit: number = 12): Promise<Product[]> {
    return ProductRepository.getProductsByCategory(category, limit);
  }

  // Business logic: Search products
  static async searchProducts(query: string, limit: number = 12): Promise<Product[]> {
    return ProductRepository.searchProducts(query, limit);
  }

  // Business logic: Get featured products
  static async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return ProductRepository.getFeaturedProducts(limit);
  }

  // Business logic: Get products on sale
  static async getProductsOnSale(limit: number = 12): Promise<Product[]> {
    return ProductRepository.getProductsOnSale(limit);
  }

  // Business logic: Get related products
  static async getRelatedProducts(
    category: string,
    excludeSlug: string,
    limit: number = 8,
  ): Promise<Product[]> {
    return ProductRepository.getRelatedProducts(category, excludeSlug, limit);
  }

  // Business logic: Slug generation
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  // Business logic: Product visibility rules
  static async getVisibleProducts(userRole?: string): Promise<ProductsResponse> {
    const params: ProductQueryParams = {
      isActive: true,
    };

    // Business rule: Admins see inactive products
    if (userRole === "admin") {
      delete params.isActive;
    }

    return ProductRepository.getAllProducts(params);
  }

  // Business logic: Price calculation with discounts
  static calculateDiscountedPrice(product: Product): number {
    if (product.discountPrice) {
      return product.discountPrice;
    }

    if (product.discount && product.discount > 0) {
      return product.price - (product.price * product.discount) / 100;
    }

    return product.price;
  }

  // Get products with filtering and pagination
  static async getProducts(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      brand?: string;
      minPrice?: number;
      maxPrice?: number;
      rating?: number;
      availability?: "in_stock" | "out_of_stock" | "all";
      tags?: string[];
      sortBy?: "name" | "price" | "rating" | "created_at" | "popularity";
      sortOrder?: "asc" | "desc";
    } = {},
  ) {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      availability,
      tags,
      sortBy = "created_at",
      sortOrder = "desc",
    } = params;

    let query = supabase
      .from("Add_Products") // Updated table name from 'products' to 'Add_Products'
      .select("*", { count: "exact" });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq("category_id", category);
    }

    if (brand) {
      query = query.ilike("brand", `%${brand}%`);
    }

    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    if (rating !== undefined) {
      query = query.gte("rating", rating);
    }

    if (availability && availability !== "all") {
      if (availability === "in_stock") {
        query = query.gt("stock_quantity", 0);
      } else {
        query = query.eq("stock_quantity", 0);
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

    const products = data.map(this.convertRowToProduct);

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

  // Get single product by slug
  static async getProductBySlug(slug: string): Promise<Product> {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();

    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return this.convertRowToProduct(data);
  }

  // Get related products by category
  static async getRelatedProducts(categoryId: string, limit: number = 8): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .limit(limit)
      .order("rating", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch related products: ${error.message}`);
    }

    return data.map(this.convertRowToProduct);
  }

  // Get products by category
  static async getProductsByCategory(
    categoryId: string,
    params: Omit<Parameters<typeof this.getProducts>[0], "category"> = {},
  ) {
    return this.getProducts({ ...params, category: categoryId });
  }

  // Search products
  static async searchProducts(
    query: string,
    params: Omit<Parameters<typeof this.getProducts>[0], "search"> = {},
  ) {
    return this.getProducts({ ...params, search: query });
  }

  // Get products by brand
  static async getProductsByBrand(
    brand: string,
    params: Omit<Parameters<typeof this.getProducts>[0], "brand"> = {},
  ) {
    return this.getProducts({ ...params, brand });
  }

  // Get products on sale
  static async getProductsOnSale(
    params: Omit<Parameters<typeof this.getProducts>[0], "tags"> = {},
  ) {
    return this.getProducts({ ...params, tags: ["sale"] });
  }

  // Get new products
  static async getNewProducts(
    params: Omit<Parameters<typeof this.getProducts>[0], "sortBy" | "sortOrder"> = {},
  ) {
    return this.getProducts({ ...params, sortBy: "created_at", sortOrder: "desc" });
  }

  // Get popular products
  static async getPopularProducts(
    params: Omit<Parameters<typeof this.getProducts>[0], "sortBy" | "sortOrder"> = {},
  ) {
    return this.getProducts({ ...params, sortBy: "rating", sortOrder: "desc" });
  }
}

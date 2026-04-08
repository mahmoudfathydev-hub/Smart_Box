import { ProductRepository } from "@/lib/repositories/product.repository";
import { ReviewsRepository } from "@/lib/repositories/reviews.repository";
import { Product, ProductQueryParams, ProductsResponse, ProductRow } from "@/types/product";
import { productAdapter } from "@/lib/adapters/product.adapter";

export class ProductsService {
  // Business logic: Get product by slug (without reviews)
  static async getProductBySlug(slug: string): Promise<Product | null> {
    const product = await ProductRepository.getProductBySlug(slug);
    if (!product) return null;

    return productAdapter.mapProductRow(product as any);
  }

  // Business logic: Get product with all related data
  static async getProductDetails(slug: string): Promise<Product | null> {
    const [product, reviews] = await Promise.all([
      ProductRepository.getProductBySlug(slug),
      ReviewsRepository.getProductAverageRating(slug),
    ]);

    if (!product) return null;

    const productWithRating = {
      ...product,
      rating: reviews.average,
    };
    return productAdapter.mapProductRow(productWithRating as any);
  }

  // Business logic: Get products with filtering
  static async getProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
    return ProductRepository.getAllProducts(params);
  }

  // Business logic: Get publicly visible products only
  static async getPublicProducts(params: ProductQueryParams = {}): Promise<ProductsResponse> {
    // Business rule: Only active and in-stock products for public view
    const filteredParams = {
      ...params,
      isActive: true,
      stock_gt: 0,
    } as ProductQueryParams;

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

    // Convert Product to ProductRow using adapter
    const productRow = productAdapter.mapProductToRow(productData);
    return ProductRepository.createProduct(productRow);
  }

  // Business logic: Update product
  static async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    // Convert Product to ProductRow using adapter
    const productRow = productAdapter.mapProductToRow(updates);
    return ProductRepository.updateProduct(id, productRow);
  }

  // Business logic: Delete product
  static async deleteProduct(id: number): Promise<void> {
    return ProductRepository.deleteProduct(id);
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
    const params: ProductQueryParams = {} as ProductQueryParams;

    // Business rule: Admins see all products, others see only active
    if (userRole !== "admin") {
      (params as any).isActive = true;
    }

    return ProductRepository.getAllProducts(params);
  }

  // Business logic: Price calculation with discounts
  static calculateDiscountedPrice(product: Product): number {
    if (product.discountPrice) {
      return product.discountPrice;
    }

    return product.price;
  }
}
